import React from "react";

import type { Cv } from "@/types/types";

interface PdfPreviewProps {
    cv: Cv;
    groupedSkills: Record<string, Cv["skills"]>;
    experience: number;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ cv, groupedSkills, experience }) => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }} id="pdf-root">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '32px' }}>
                <h2 style={{ margin: 0 }}>{cv.user.profile.full_name}</h2>
                <span>{cv.user.position_name}</span>
            </div>

            <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 2 }}>
                    <strong>Education</strong>
                    <p>{cv.education || '—'}</p>

                    {cv.languages.length > 0 && <div>
                        <strong>Language proficiency</strong>
                        {cv.languages.map(lang => (
                            <p key={lang.name}>{lang.name} – {lang.proficiency}</p>
                        ))}
                    </div>}

                    {cv.projects.map(p => p.domain).filter(Boolean).length > 0 && <div>
                        <strong>Domains</strong>
                        <p>{cv.projects.map(p => p.domain).filter(Boolean).join(', ')}</p>
                    </div>}
                </div>

                <div style={{ flex: 3, borderLeft: '1px solid #c63031', paddingLeft: 40 }}>
                    <p>{cv.name}</p>

                    <p>{cv.description || "No description provided."}</p>

                    {Object.entries(groupedSkills).length > 0 && Object.entries(groupedSkills).map(([category, skills]) => (
                        <div key={category} style={{ marginBottom: '8px' }}>
                            <p style={{ marginBottom: '2px', fontWeight: 'bold' }}>{category}</p>
                            <p style={{ marginTop: 0 }}>{skills.map(skill => skill.name).join(', ') + '.'}</p>
                        </div>
                    ))}
                </div>
            </div>

            {cv.projects.length > 0 && <div style={{ marginTop: '24px' }}>
                <h2>Projects</h2>
                {cv.projects.map(p => (
                    <div key={p.id} style={{ display: 'flex', gap: '40px', marginBottom: '24px' }}>
                        <div style={{ flex: 2 }}>
                            <p style={{ color: '#c63031', fontWeight: 600 }}>{p.name}</p>
                            <p style={{ color: '#666' }}>{p.description || "No description"}</p>
                        </div>
                        <div style={{ flex: 3, borderLeft: '1px solid #c63031', paddingLeft: 40 }}>
                            <p style={{ display: 'flex', flexDirection: 'column' }}><strong>Project roles:</strong> {p.roles.length > 0 ? p.roles.join(', ') : (cv.user.position_name || 'No description')}</p>
                            <p style={{ display: 'flex', flexDirection: 'column' }}><strong>Period:</strong> {p.start_date} - {p.end_date || 'Till now'}</p>

                            {p.responsibilities.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <strong>Responsibilities:</strong>
                                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                                        {p.responsibilities.map((resp, i) => (
                                            <li key={i}>{resp}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {p.environment.length > 0 && (
                                <p style={{ display: 'flex', flexDirection: 'column' }}><strong>Environment:</strong> {p.environment.join(', ')}.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>}

            {Object.entries(groupedSkills).length > 0 && <div style={{ marginTop: '24px' }}>
                <h2>Professional skills</h2>
                <div style={{ display: 'flex', fontWeight: 600, borderBottom: '1px solid #c63031', paddingBottom: 4 }}>
                    <div style={{ flex: 2 }}>Skill</div>
                    <div style={{ flex: 1 }}>Experience (years)</div>
                    <div style={{ flex: 1 }}>Last used</div>
                </div>
                {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category} style={{ borderBottom: '1px solid #eee', marginTop: 8 }}>
                        {skills.map((skill, index) => (
                            <div key={skill.name} style={{ display: 'flex', padding: '2px 0', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    {index === 0 && <span style={{ fontWeight: 600, color: '#c63031' }}>{category}</span>}
                                </div>
                                <div style={{ flex: 1, paddingLeft: 16 }}>{skill.name}</div>
                                <div style={{ flex: 1 }}>{experience < 1 ? '<1' : Math.floor(experience)}</div>
                                <div style={{ flex: 1 }}></div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>}
        </div >
    );
};