// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Memulai proses seeding database...');

    // 1. Bersihkan data lama jika ada (untuk menghindari duplikasi data saat seeding ulang)
    await prisma.userSkill.deleteMany({});
    await prisma.careerSkill.deleteMany({});
    await prisma.recommendation.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.career.deleteMany({});

    // 2. Daftarkan Master Skills
    const skillNames = [
        'PHP', 'Laravel', 'MySQL', 'Docker', 'Linux',
        'React', 'Next.js', 'Tailwind CSS', 'CSS', 'HTML',
        'TypeScript', 'JavaScript', 'Node.js', 'NestJS', 'PostgreSQL',
        'Kubernetes', 'AWS', 'CI/CD', 'Git', 'Redis'
    ];

    const skills = await Promise.all(
        skillNames.map((name) =>
            prisma.skill.upsert({
                where: { name },
                update: {},
                create: { name },
            })
        )
    );

    const skillMap = new Map(skills.map((s) => [s.name, s.id]));

    const getSkillId = (name: string) => {
        const id = skillMap.get(name);
        if (!id) throw new Error(`Skill ${name} tidak ditemukan dalam daftar.`);
        return id;
    };

    // 3. Daftarkan Master Careers & Hubungkan ke Skill terkait
    const careersData = [
        {
            title: 'Backend Developer',
            description: 'Fokus pada logika server, basis data, integrasi API, dan kinerja aplikasi di latar belakang.',
            skills: ['PHP', 'Laravel', 'MySQL', 'Docker', 'Linux', 'Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'Git'],
        },
        {
            title: 'Frontend Developer',
            description: 'Fokus pada pengembangan antarmuka visual pengguna, performa halaman web, dan interaktivitas.',
            skills: ['React', 'Next.js', 'Tailwind CSS', 'CSS', 'HTML', 'TypeScript', 'JavaScript', 'Git'],
        },
        {
            title: 'DevOps Engineer',
            description: 'Fokus pada otomatisasi deployment, pengelolaan infrastruktur cloud, CI/CD, dan pemantauan sistem.',
            skills: ['Docker', 'Linux', 'Kubernetes', 'AWS', 'CI/CD', 'Git'],
        },
    ];

    for (const career of careersData) {
        const createdCareer = await prisma.career.upsert({
            where: { title: career.title },
            update: { description: career.description },
            create: {
                title: career.title,
                description: career.description,
            },
        });

        // Hubungkan skill ke karir tersebut
        for (const skillName of career.skills) {
            const skillId = getSkillId(skillName);
            await prisma.careerSkill.upsert({
                where: {
                    careerId_skillId: {
                        careerId: createdCareer.id,
                        skillId: skillId,
                    },
                },
                update: {},
                create: {
                    careerId: createdCareer.id,
                    skillId: skillId,
                },
            });
        }
    }

    console.log('Proses seeding database selesai dengan sukses!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });