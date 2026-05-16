import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/lead';

export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, status, source, search, sort = 'latest' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const query: any = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Fix TypeScript error by using standard object notation or as any for Mongoose dynamic sorting
    const sortOption: any = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Lead.countDocuments(query);
    
    res.json({ 
      success: true, 
      data: leads, 
      meta: { total, page: Number(page), limit: Number(limit) } 
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await Lead.find({});
    const csv = [
      ['Name', 'Email', 'Status', 'Source', 'Created At'],
      ...leads.map(l => [l.name, l.email, l.status, l.source, l.createdAt.toISOString()]),
    ].map(e => e.join(',')).join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
