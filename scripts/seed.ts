
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 12);
  const adminHashedPassword = await bcrypt.hash("admin123", 12);
  const johnHashedPassword = await bcrypt.hash("johndoe123", 12);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      email: "admin@demo.com",
      name: "Admin User",
      password: adminHashedPassword,
    },
  });

  // Create regular users
  const aliceUser = await prisma.user.upsert({
    where: { email: "alice@demo.com" },
    update: {},
    create: {
      email: "alice@demo.com",
      name: "Alice Johnson",
      password: hashedPassword,
    },
  });

  const bobUser = await prisma.user.upsert({
    where: { email: "bob@demo.com" },
    update: {},
    create: {
      email: "bob@demo.com",
      name: "Bob Smith",
      password: hashedPassword,
    },
  });

  // Create test account (required by system)
  const johnUser = await prisma.user.upsert({
    where: { email: "john@doe.com" },
    update: {},
    create: {
      email: "john@doe.com",
      name: "John Doe",
      password: johnHashedPassword,
    },
  });

  console.log("✅ Created users");

  // Create sample public documents
  const publicDoc1 = await prisma.document.upsert({
    where: { id: "sample-public-1" },
    update: {},
    create: {
      id: "sample-public-1",
      title: "Welcome to NotionLite",
      content: `# Welcome to NotionLite! 🎉

This is a **public document** that everyone can view and edit. NotionLite is a simple document management system inspired by Notion.

## Key Features

- **User Authentication**: Secure login system
- **Document Management**: Create, edit, and organize your documents
- **Public & Private Documents**: Control who can access your content
- **Image Upload**: Add images to your documents
- **Collaborative Editing**: Public documents can be edited by anyone
- **Clean Interface**: Minimalist black and white design

## Getting Started

1. Create a new document using the "New Document" button
2. Choose whether to make it public or private
3. Add content using simple markdown formatting
4. Upload images to make your documents more engaging

## Markdown Support

You can use basic markdown formatting:

- **Bold text** with **asterisks**
- *Italic text* with *single asterisks*
- # Headers with hash symbols
- ## Subheaders
- ### Smaller headers

## Image Support

You can upload and embed images directly in your documents. Just click the "Add Image" button while editing!

---

*Happy documenting! 📝*`,
      isPublic: true,
      createdById: adminUser.id,
      lastEditedById: adminUser.id,
    },
  });

  const publicDoc2 = await prisma.document.upsert({
    where: { id: "sample-public-2" },
    update: {},
    create: {
      id: "sample-public-2",
      title: "Project Planning Template",
      content: `# Project Planning Template

This is a **collaborative template** that can be used for project planning. Feel free to edit and adapt it for your needs!

## Project Overview

**Project Name:** [Enter project name]
**Start Date:** [Enter start date]
**End Date:** [Enter end date]
**Project Manager:** [Enter name]

## Objectives

- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

## Team Members

1. **Name** - Role - Contact
2. **Name** - Role - Contact
3. **Name** - Role - Contact

## Timeline

### Phase 1: Planning
- Research and requirements gathering
- Timeline: [dates]

### Phase 2: Development
- Implementation and testing
- Timeline: [dates]

### Phase 3: Launch
- Deployment and monitoring
- Timeline: [dates]

## Resources Needed

- **Budget:** $[amount]
- **Tools:** [list tools]
- **External Resources:** [list resources]

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | High/Medium/Low | High/Medium/Low | [Strategy] |
| [Risk 2] | High/Medium/Low | High/Medium/Low | [Strategy] |

## Notes

[Add any additional notes or considerations here]

---

*Template created by the NotionLite community*`,
      isPublic: true,
      createdById: aliceUser.id,
      lastEditedById: aliceUser.id,
    },
  });

  // Create sample private documents
  const privateDoc1 = await prisma.document.create({
    data: {
      title: "My Personal Notes",
      content: `# My Personal Notes

This is a **private document** - only I can see and edit this content.

## Daily Thoughts

- Today was productive
- Need to work on the presentation tomorrow
- Remember to call mom

## Ideas

- App feature: Dark mode toggle
- Weekend project: Build a weather app
- Book to read: "Clean Code"

## Goals for This Week

1. ✅ Complete the database design
2. ⏳ Finish the user interface
3. ⏳ Write documentation
4. ❌ Deploy to production

---

*These are my private thoughts and reminders.*`,
      isPublic: false,
      createdById: bobUser.id,
      lastEditedById: bobUser.id,
    },
  });

  console.log("✅ Created sample documents");

  console.log("🎉 Database seeded successfully!");
  console.log("\n📧 Demo Accounts:");
  console.log("- admin@demo.com / admin123");
  console.log("- alice@demo.com / password123");
  console.log("- bob@demo.com / password123");
  console.log("- john@doe.com / johndoe123 (test account)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
