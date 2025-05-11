export const sectionConfigs = {
  Experience: {
    sectionName: "experiences",
    items: [],
    fields: [
      { name: "title", placeholder: "Job Title", required: true },
      { name: "company_name", placeholder: "Company Name", required: true },
      { name: "employment_type", placeholder: "Employment Type", type: "select", options: [
          { value: "Full-time", label: "Full-time" },
          { value: "Part-time", label: "Part-time" },
          { value: "Contract", label: "Contract" },
          { value: "Freelance", label: "Freelance" },
          { value: "Internship", label: "Internship" }
        ], required: true
      },
      { name: "location", placeholder: "Location" },
      { name: "start_date", placeholder: "Start Date", type: "date", required: true },
      { name: "end_date", placeholder: "End Date", type: "date" },
      { name: "is_currently_working", placeholder: "Currently working here", type: "checkbox" },
      { name: "description", placeholder: "Job Description", type: "textarea", rows: 4 }
    ]
  },
  Education: {
    sectionName: "educations",
    items: [],
    fields: [
      { name: "degree", placeholder: "Degree", required: true },
      { name: "institution", placeholder: "Institution", required: true },
      { name: "field_of_study", placeholder: "Field of Study" },
      { name: "start_date", placeholder: "Start Date", type: "date", required: true },
      { name: "end_date", placeholder: "End Date", type: "date" },
      { name: "is_currently_studying", placeholder: "Currently studying here", type: "checkbox" },
      { name: "description", placeholder: "Description", type: "textarea", rows: 3 }
    ]
  },
  Projects: {
    sectionName: "projects",
    items: [],
    fields: [
      { name: "name", placeholder: "Project Name", required: true },
      { name: "description", placeholder: "Description", type: "textarea", rows: 4, required: true },
      { name: "technologies", placeholder: "Technologies used" },
      { name: "start_date", placeholder: "Start Date", type: "date" },
      { name: "end_date", placeholder: "End Date", type: "date" },
      { name: "url", placeholder: "Project URL", type: "url" },
      { name: "github_url", placeholder: "GitHub URL", type: "url" }
    ]
  },
  Certifications: {
    sectionName: "certifications",
    items: [],
    fields: [
      { name: "name", placeholder: "Certification Name", required: true },
      { name: "organization", placeholder: "Issuing Organization", required: true },
      { name: "issue_date", placeholder: "Issue Date", type: "date" },
      { name: "expiration_date", placeholder: "Expiration Date", type: "date" },
      { name: "credential_id", placeholder: "Credential ID" },
      { name: "credential_url", placeholder: "Credential URL", type: "url" }
    ]
  },
  Skills: {
    sectionName: "skills",
    items: [],
    fields: [{ name: "name", placeholder: "Skill", required: true }]
  },
  Languages: {
    sectionName: "languages",
    items: [],
    fields: [
      { name: "name", placeholder: "Language", required: true },
      { name: "proficiency", placeholder: "Proficiency", type: "select", options: [
          { value: "Native", label: "Native" },
          { value: "Fluent", label: "Fluent" },
          { value: "Intermediate", label: "Intermediate" },
          { value: "Beginner", label: "Beginner" }
        ], required: true
      }
    ]
  }
};
