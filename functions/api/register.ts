import { z } from 'zod';

const teamRegistrationSchema = z.object({
  teamName: z.string().min(2),
  college: z.string().min(2),
  year: z.string().min(1),
  teamSize: z.string().min(1),
  leaderName: z.string().min(2),
  leaderResume: z.string().url(),
  email: z.string().email(),
  phone: z.string().min(10),
  members: z.array(z.object({
    name: z.string().min(2),
    resume: z.string().url()
  })).optional(),
});

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}


async function getAccessToken(credentials: any): Promise<string> {
  const jwtHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  
  const now = Math.floor(Date.now() / 1000);
  const jwtClaimSet = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };
  
  const jwtClaimSetEncoded = Buffer.from(JSON.stringify(jwtClaimSet)).toString('base64url');
  const signatureInput = `${jwtHeader}.${jwtClaimSetEncoded}`;
  
  // Import the private key
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(credentials.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign the JWT
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(signatureInput)
  );
  
  const signatureEncoded = Buffer.from(signature).toString('base64url');
  const jwt = `${signatureInput}.${signatureEncoded}`;
  
  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  
  if (!tokenResponse.ok) {
    throw new Error(`Failed to get access token: ${tokenResponse.statusText}`);
  }
  
  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function appendToSheet(accessToken: string, spreadsheetId: string, sheetName: string, row: any[]) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:append?valueInputOption=USER_ENTERED`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [row],
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to append to sheet: ${response.statusText} - ${error}`);
  }
  
  return await response.json();
}

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    
    console.log('Registration request received');
    
    // Validate the data
    const validatedData = teamRegistrationSchema.parse(body);

    console.log('Registration request received:', {
      teamName: validatedData.teamName,
      college: validatedData.college,
      email: validatedData.email,
    });

    const auth = await getAuth(context.env);
    if (!auth) {
      throw new Error('Failed to authenticate with Google Sheets');
    }

    const spreadsheetId = context.env.GOOGLE_SHEETS_ID;
    
    if (!credentialsJson) {
      throw new Error('GOOGLE_SHEETS_CREDENTIALS not configured');
    }
    
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const sheetName = context.env.GOOGLE_SHEETS_NAME || 'Team Registrations';
    
    // Parse credentials and get access token
    const credentials = JSON.parse(credentialsJson);
    const accessToken = await getAccessToken(credentials);
    
    console.log('Access token obtained');

    // Prepare row data
    const row = [
      validatedData.teamName,
      validatedData.college,
      validatedData.year,
      validatedData.teamSize,
      validatedData.leaderName,
      validatedData.leaderResume,
      validatedData.email,
      validatedData.phone,
      validatedData.members?.[0]?.name || '',
      validatedData.members?.[0]?.resume || '',
      validatedData.members?.[1]?.name || '',
      validatedData.members?.[1]?.resume || '',
      new Date().toISOString()
    ];

    // Append to Google Sheets
    await appendToSheet(accessToken, spreadsheetId, sheetName, row);
    
    console.log('Data appended to sheet successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Team registered successfully',
        data: {
          teamName: validatedData.teamName,
          email: validatedData.email
        }
      }),
      {
        status: 201,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error('Registration error:', error instanceof Error ? error.message : String(error));

    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Validation error',
          errors: errorMessages
        }),
        {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
