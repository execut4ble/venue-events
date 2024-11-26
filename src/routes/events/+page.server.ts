import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const { sql } = locals;

    const events = await sql`select * from events order by date asc`

    return {events};
}) satisfies PageServerLoad;