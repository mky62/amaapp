import { headers } from "next/headers";
import { auth } from "./auth";
import { NextRequest } from 'next/server'    

    
export async function getServerSession(req: NextRequest ) {
  return await auth.api.getSession({
    headers: req.headers,
  });
}