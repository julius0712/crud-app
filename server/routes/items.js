const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const router = Router();

// READ ALL
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('items')
        .select('*').order('created_at');
    if (error) return res.status(500).json({ error });
    res.json(data);
});

// CREATE
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    const { data, error } = await supabase.from('items')
        .insert([{ name, description }]).select();
    if (error) return res.status(500).json({ error });
    res.status(201).json(data[0]);
});

// UPDATE
router.put('/:id', async (req, res) => {   // ✅ /:id
    const { name, description } = req.body;
    const { data, error } = await supabase.from('items')
        .update({ name, description }).eq('id', req.params.id).select();
    if (error) return res.status(500).json({ error });
    res.json(data[0]);
});

// DELETE
router.delete('/:id', async (req, res) => {  // ✅ /:id
    const { error } = await supabase.from('items')
        .delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error });
    res.status(204).send();
});

module.exports = router;