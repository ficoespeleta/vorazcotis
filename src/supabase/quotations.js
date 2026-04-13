import { createClient } from '../utils/supabase/client';
const supabase = createClient();

export const getQuotations = async () => {
  const { data, error } = await supabase
    .from('quotations')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const getQuotationById = async (id) => {
  const { data, error } = await supabase
    .from('quotations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createQuotation = async (quotation) => {
  const { data, error } = await supabase
    .from('quotations')
    .insert([quotation])
    .select();

  if (error) throw error;
  return data[0];
};

export const updateQuotation = async (id, quotation) => {
  const { data, error } = await supabase
    .from('quotations')
    .update(quotation)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteQuotation = async (id) => {
  const { error } = await supabase
    .from('quotations')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
