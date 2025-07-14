import { createClient } from '@supabase/supabase-js'

const URL = 'https://jjxgfoxkfvkosriudbdr.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqeGdmb3hrZnZrb3NyaXVkYmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Nzk2NjMsImV4cCI6MjA2NzA1NTY2M30.rEv_VkST52I0gGZKOksy2jD7WMbyy2TUOIeIxk7K6WM';

export const supabase = createClient(URL, API_KEY);