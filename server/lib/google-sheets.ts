import { google } from 'googleapis';
import { TeamRegistration, ContactMessage, RecruitmentApplication } from '../../shared/schema';
import { getGoogleAuth } from './google-auth';

async function getAuth() {
    return getGoogleAuth();
}

// Helper to ensure sheet exists
async function ensureSheetExists(sheets: any, spreadsheetId: string, sheetName: string, headers: string[]) {
    try {
        const response = await sheets.spreadsheets.get({
            spreadsheetId,
        });

        const sheetExists = response.data.sheets?.some(
            (s: any) => s.properties?.title === sheetName
        );

        if (!sheetExists) {
            console.log(`Sheet '${sheetName}' does not exist. Creating it...`);
            await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title: sheetName,
                                },
                            },
                        },
                    ],
                },
            });

            // Add headers
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `${sheetName}!A1`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [headers],
                },
            });
            console.log(`Sheet '${sheetName}' created with headers.`);
        }
        return true;
    } catch (error) {
        console.error(`Error ensuring sheet '${sheetName}' exists:`, error);
        return false;
    }
}

export async function appendTeamRegistration(data: TeamRegistration): Promise<boolean> {
    const auth = await getAuth();
    if (!auth) return false;

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
        console.warn("GOOGLE_SHEETS_ID is not set");
        return false;
    }

    const sheetName = process.env.GOOGLE_SHEETS_NAME || 'Team Registrations';

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        // Ensure sheet exists before appending
        const headers = ['Team Name', 'College', 'Year', 'Team Size', 'Leader Name', 'Leader Resume', 'Email', 'Phone', 'Member 2 Name', 'Member 2 Resume', 'Member 3 Name', 'Member 3 Resume', 'Created At'];
        await ensureSheetExists(sheets, spreadsheetId, sheetName, headers);

        // Prepare the row data based on the schema and setup guide
        // Headers: Team Name | College | Year | Team Size | Leader Name | Leader Resume | Email | Phone | Member 2 Name | Member 2 Resume | Member 3 Name | Member 3 Resume
        const row = [
            data.teamName,
            data.college,
            data.year,
            data.teamSize,
            data.leaderName,
            data.leaderResume,
            data.email,
            data.phone,

            // Explicitly handle members to ensure columns align
            // Member 1 (if exists, though usually teamSize >= 2 means at least 1 member + leader?)
            // Actually leader is separate. So Members array contains the other members.

            // Member 2 (First person in members array)
            data.members?.[0]?.name || "",
            data.members?.[0]?.resume || "",

            // Member 3 (Second person in members array)
            data.members?.[1]?.name || "",
            data.members?.[1]?.resume || "",
        ];

        // Timestamp
        row.push(new Date().toISOString());

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A1`, // Append to the sheet
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });

        console.log("Successfully appended registration to Google Sheets");
        return true;
    } catch (error) {
        console.error("Failed to append to Google Sheets:", error);
        return false;
    }
}

export async function appendContactMessage(data: ContactMessage): Promise<boolean> {
    const auth = await getAuth();
    if (!auth) return false;

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
        return false;
    }

    const sheetName = 'Contact Messages';

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        const headers = ['Name', 'Email', 'Subject', 'Message', 'Created At'];
        await ensureSheetExists(sheets, spreadsheetId, sheetName, headers);

        const row = [
            data.name,
            data.email,
            data.subject,
            data.message,
            data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });

        return true;
    } catch (error) {
        console.warn("Failed to append contact message to Google Sheets:", error);
        return false;
    }
}

export async function appendRecruitmentApplication(data: RecruitmentApplication): Promise<boolean> {
    const auth = await getAuth();
    if (!auth) return false;

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
        console.warn("GOOGLE_SHEETS_ID is not set");
        return false;
    }

    const sheetName = 'First Year Recruitment';

    try {
        const sheets = google.sheets({ version: 'v4', auth });

        const headers = [
            'Timestamp',
            'Full Name',
            'Email',
            'Phone',
            'College / Branch',
            'Year of Study',
            'Preference 1',
            'Preference 2',
            'About Yourself',
            'Why Join DataZen',
            'Resume / Drive Link',
        ];
        await ensureSheetExists(sheets, spreadsheetId, sheetName, headers);

        const row = [
            new Date().toISOString(),
            data.name,
            data.email,
            data.phone,
            data.college,
            data.year,
            data.preference1,
            data.preference2,
            data.aboutSelf,
            data.whyJoin,
            data.resumeUrl || '',
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });

        console.log("Successfully appended recruitment application to Google Sheets");
        return true;
    } catch (error) {
        console.error("Failed to append recruitment application to Google Sheets:", error);
        return false;
    }
}
