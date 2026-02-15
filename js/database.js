const COMPLIANCE_DATABASE = [
    {
        id: "biosecurity",
        category: "Biosecurity & Infection Control",
        icon: "🔬",
        items: [
            { id: "b1", text: "Is there a designated hand-washing station in the procedure area?", weight: 10 },
            { id: "b2", text: "Are EPA-registered, hospital-grade disinfectants used on all surfaces?", weight: 10 },
            { id: "b3", text: "Are single-use, sterile gloves used for every procedure?", weight: 5 },
            { id: "b4", text: "Is there a sharp container located within arm's reach of the procedure area?", weight: 10 },
            { id: "b5", text: "Are all reusable tools processed through a validated autoclave cycle?", weight: 15 }
        ]
    },
    {
        id: "documentation",
        category: "Documentation & Legal",
        icon: "📝",
        items: [
            { id: "d1", text: "Is an informed consent form signed and archived for every client?", weight: 10 },
            { id: "d2", text: "Are sterilization logs maintained for every autoclave cycle?", weight: 10 },
            { id: "d3", text: "Are biological indicator (spore test) results archived weekly?", weight: 10 },
            { id: "d4", text: "Is there a bloodborne pathogen certificate on file for all staff?", weight: 5 },
            { id: "d5", text: "Are ink and jewelry batch certifications accessible for audit?", weight: 5 }
        ]
    },
    {
        id: "facility",
        category: "Facility Standards",
        icon: "🏢",
        items: [
            { id: "f1", text: "Is the procedure area physically separated from the waiting area?", weight: 5 },
            { id: "f2", text: "Are floors and walls constructed of non-porous, easy-to-clean materials?", weight: 5 },
            { id: "f3", text: "Is the studio free of animals (except service animals)?", weight: 5 },
            { id: "f4", text: "Is there adequate lighting in the procedure area?", weight: 2 },
            { id: "f5", text: "Is the sterilization room separate from the procedure area?", weight: 10 }
        ]
    }
];
