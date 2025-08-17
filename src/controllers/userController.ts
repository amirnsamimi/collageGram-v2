import type {Request, Response} from "express";
import {type insertUser, type selectUser, userAssets, users} from "../db/schema.ts";
import db from "../db/connection.ts";
import {eq} from "drizzle-orm"
import type {AuthenticatedRequest} from "../middleware/auth.ts";

// export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
//     try {
//         const [users] = await db.query.users.findMany({})
//         return res.status(200).json(users)
//     } catch (err) {
//         console.log("Get User by Username", err)
//         res.status(500).json({error: 'failed to get users'})
//     }
// }


export const getUsersById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await db.query.users.findFirst({
                where: eq(users.id, req.user.id)
            }
        )
        return res.status(200).json(user)
    } catch
        (err) {
        console.log("Get User by Username", err)
        res.status(500).json({error: 'failed to get users'})
    }

}

export const patchUserById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {...updates} = req.body

        const result = await db.update(users).set(updates).where(eq(users.id, req.user.id)).returning()
        if (!result) {
            return res.status(401).end()
        }
        res.status(200).json({message: 'user updated successfully'})
    } catch (err) {
        console.log("Patch User by Username", err)
        res.status(500).json({error: 'failed to update user'})
    }
}

export const addUserAssets = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const files = req.files as Express.MulterS3.File[];
        if (!files || files.length === 0) {
            console.log('No files uploaded')
            process.exit(1)
        }

        await db.transaction(async (tx) => {
            for (const file of files) {
                await tx.insert(userAssets).values({
                    userId: req.user.id,
                    name: file.originalname,
                    type: file.mimetype,
                    url: file.location,

                });
            }
        });

        // Respond with all uploaded file info
        const uploadedFiles = files.map(f => ({
            size: f.size,
            url: f.location,
            name: f.key,
            type: f.mimetype,
        }));

        res.send({
            status: 'success',
            message: `${files.length} files uploaded!`,
            files: uploadedFiles,
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({status: 'error', message: err.message});
    }
}
//
// export const addUserProfilePic = async (req: AuthenticatedRequest, res: Response) => {
//     try {
//         const file = req.files;
//         if (!file) {
//             console.log('No files uploaded')
//             return res.status(400).json({status: 'error', message: 'No files uploaded'});
//         }
//
//         await db.insert(userAssets).values({
//             userId: req.user.id,
//             name: file.originalname,
//             type: file.mimetype,
//             url: file.location,
//
//         });
//
//         const uploadedFile = files.map(f => ({
//             size: f.size,
//             url: f.location,
//             name: f.key,
//             type: f.mimetype,
//         }));
//
//         res.send({
//             status: 'success',
//             message: `${files.length} files uploaded!`,
//             files: uploadedFiles,
//         });
//     } catch (err: any) {
//         console.error(err);
//         res.status(500).send({status: 'error', message: err.message});
//     }
// }