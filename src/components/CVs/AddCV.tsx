import { useMutation, useQuery } from '@apollo/client';
import {
    Add, Delete
} from '@mui/icons-material';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton, MenuItem, Stack, TextField, Typography
} from '@mui/material';
import { useState } from 'react';

import { CREATE_CV } from '@/api/mutations/createCV';
import { GET_LANGUAGES } from '@/api/queries/getLanguages';
import { GET_SKILLS } from '@/api/queries/getSkills';
import { useAlert } from '@/ui/Alert/useAlert';

import { getId, langLevels } from '../constants';
import type { LanguagesData } from '../Languages/Languages';
import type { SkillsData } from '../Skills/Skills';

type LanguageInput = {
    name: string;
    proficiency: string;
};

type SkillInput = {
    name: string;
    categoryId: string;
    mastery: string;
};

type ProjectInput = {
    name: string;
    internal_name: string;
    description: string;
    domain: string;
    start_date: string;
    end_date: string;
    environment: string;
    roles: string;
    responsibilities: string;
};

type CvFormState = {
    name: string;
    education: string;
    description: string;
    languages: LanguageInput[];
    skills: SkillInput[];
    projects: ProjectInput[];
};


export const AddCV = () => {
    const userId = getId();
    const { showAlert } = useAlert();
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState<CvFormState>({
        name: '',
        education: '',
        description: '',
        languages: [{ name: '', proficiency: '' }],
        skills: [{ name: '', categoryId: '', mastery: '' }],
        projects: [{
            name: '', internal_name: '', description: '', domain: '',
            start_date: '', end_date: '', environment: '',
            roles: '', responsibilities: ''
        }]
    });

    const { data: langData } = useQuery<LanguagesData>(GET_LANGUAGES);
    const { data: skillsData } = useQuery<SkillsData>(GET_SKILLS);

    const [createCv] = useMutation(CREATE_CV);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setForm({
            name: '', education: '', description: '',
            languages: [{ name: '', proficiency: '' }],
            skills: [{ name: '', categoryId: '', mastery: '' }],
            projects: [{
                name: '', internal_name: '', description: '', domain: '',
                start_date: '', end_date: '', environment: '',
                roles: '', responsibilities: ''
            }]
        });
        setOpen(false);
    };

    const handleChange = (field: string, value: unknown) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = <
        T extends {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [K in keyof CvFormState]: CvFormState[K] extends Array<any> ? K : never
        }[keyof CvFormState],
        K extends keyof CvFormState[T][number]
    >(
        section: T,
        index: number,
        field: K,
        value: CvFormState[T][number][K]
    ) => {
        const updated = [...form[section]] as CvFormState[T];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setForm(prev => ({ ...prev, [section]: updated }));
    };




    const addField = (section: keyof typeof form, emptyObj: unknown) => {
        setForm(prev => ({ ...prev, [section]: [...prev[section], emptyObj] }));
    };

    const removeField = (section: keyof typeof form, index: number) => {
        const updated = [...form[section]];
        updated.splice(index, 1);
        setForm(prev => ({ ...prev, [section]: updated }));
    };

    const cleanArray = <T extends Record<string, unknown>>(arr: T[]): T[] =>
        arr.filter(obj => Object.values(obj).some(v => v !== ''));

    const handleSubmit = async () => {
        if (!form.name || !form.description) {
            showAlert({ type: 'error', message: 'Name and description are required' });
            return;
        }

        const input: Partial<CvFormState> & { name: string; description: string; userId: string | null } = {
            name: form.name,
            description: form.description,
            userId
        };
        if (form.education) input.education = form.education;

        const cleanedLanguages = cleanArray(form.languages);
        if (cleanedLanguages.length) input.languages = cleanedLanguages;

        const cleanedSkills = cleanArray(form.skills);
        if (cleanedSkills.length) input.skills = cleanedSkills;

        const cleanedProjects = cleanArray(form.projects);
        if (cleanedProjects.length) input.projects = cleanedProjects;

        try {
            const { data } = await createCv({ variables: { input } });
            showAlert({ type: 'success', message: 'CV created successfully' });
            console.log('Created CV:', data.createCv);
            handleClose();
        } catch (err) {
            console.error('Error creating CV:', err);
            showAlert({ type: 'error', message: 'Failed to create CV' });
        }
    };

    const isDisabled = !form.name || !form.description;

    return (
        <>
            <Button variant="contained" onClick={handleOpen}>Add new CV</Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Create New CV</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Name"
                            required
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                        />
                        <TextField
                            label="Education"
                            value={form.education}
                            onChange={e => handleChange('education', e.target.value)}
                        />
                        <TextField
                            label="Description"
                            required
                            multiline
                            rows={3}
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                        />

                        {/* LANGUAGES */}
                        <Typography variant="h6" mt={2}>Languages</Typography>
                        {form.languages.map((lang, i) => (
                            <Grid container spacing={1} alignItems="center" key={i}>
                                <Grid size={5}>
                                    <TextField
                                        select
                                        label="Language"
                                        value={lang.name}
                                        onChange={e => handleArrayChange('languages', i, 'name', e.target.value)}
                                        fullWidth
                                    >
                                        {langData?.languages?.map((l) => (
                                            <MenuItem key={l.id} value={l.name}>{l.name}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={5}>
                                    <TextField
                                        select
                                        label="Proficiency"
                                        value={lang.proficiency}
                                        onChange={e => handleArrayChange('languages', i, 'proficiency', e.target.value)}
                                        fullWidth
                                    >
                                        {langLevels.map(level => (
                                            <MenuItem key={level} value={level}>{level}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={2}>
                                    <IconButton onClick={() => removeField('languages', i)}><Delete /></IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={() => addField('languages', { name: '', proficiency: '' })} startIcon={<Add />}>
                            Add Language
                        </Button>

                        {/* SKILLS */}
                        <Typography variant="h6" mt={2}>Skills</Typography>
                        {form.skills.map((skill, i) => (
                            <Grid container spacing={1} alignItems="center" key={i}>
                                <Grid size={5}>
                                    <TextField
                                        select
                                        label="Skill"
                                        value={skill.name}
                                        onChange={e => {
                                            const selected = skillsData?.skills.find((s) => s.name === e.target.value);
                                            handleArrayChange('skills', i, 'name', e.target.value);
                                            handleArrayChange('skills', i, 'categoryId', selected?.category?.id || '');
                                        }}
                                        fullWidth
                                    >
                                        {skillsData?.skills?.map((s) => (
                                            <MenuItem key={s.id} value={s.name}>
                                                {s.name} ({s.category?.name})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={5}>
                                    <TextField
                                        label="Mastery"
                                        value={skill.mastery}
                                        onChange={e => handleArrayChange('skills', i, 'mastery', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid size={2}>
                                    <IconButton onClick={() => removeField('skills', i)}><Delete /></IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={() => addField('skills', { name: '', categoryId: '', mastery: '' })} startIcon={<Add />}>
                            Add Skill
                        </Button>

                        {/* PROJECTS */}
                        <Typography variant="h6" mt={2}>Projects</Typography>
                        {form.projects.map((proj, i) => (
                            <Stack spacing={1} key={i} border={1} p={2} borderRadius={2} borderColor="divider">
                                <Grid container spacing={1}>
                                    <Grid size={6}>
                                        <TextField label="Name" fullWidth value={proj.name} onChange={e => handleArrayChange('projects', i, 'name', e.target.value)} />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField label="Internal Name" fullWidth value={proj.internal_name} onChange={e => handleArrayChange('projects', i, 'internal_name', e.target.value)} />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField label="Description" fullWidth value={proj.description} onChange={e => handleArrayChange('projects', i, 'description', e.target.value)} />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField label="Domain" fullWidth value={proj.domain} onChange={e => handleArrayChange('projects', i, 'domain', e.target.value)} />
                                    </Grid>
                                    <Grid size={3}>
                                        <TextField label="Start Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={proj.start_date} onChange={e => handleArrayChange('projects', i, 'start_date', e.target.value)} />
                                    </Grid>
                                    <Grid size={3}>
                                        <TextField label="End Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={proj.end_date} onChange={e => handleArrayChange('projects', i, 'end_date', e.target.value)} />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField label="Environment" fullWidth value={proj.environment} onChange={e => handleArrayChange('projects', i, 'environment', e.target.value)} />
                                    </Grid>
                                    <Grid size={6}>
                                        <TextField label="Roles" fullWidth value={proj.roles} onChange={e => handleArrayChange('projects', i, 'roles', e.target.value)} />
                                    </Grid>
                                    <Grid size={12}>
                                        <TextField label="Responsibilities" fullWidth value={proj.responsibilities} onChange={e => handleArrayChange('projects', i, 'responsibilities', e.target.value)} />
                                    </Grid>
                                    <Grid size={12}>
                                        <IconButton onClick={() => removeField('projects', i)}><Delete /></IconButton>
                                    </Grid>
                                </Grid>
                            </Stack>
                        ))}
                        <Button onClick={() => addField('projects', {
                            name: '', internal_name: '', description: '', domain: '',
                            start_date: '', end_date: '', environment: '',
                            roles: '', responsibilities: ''
                        })} startIcon={<Add />}>
                            Add Project
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={isDisabled}>Create</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
