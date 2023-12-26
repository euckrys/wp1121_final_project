import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { profileInfoTable, usersTable } from "@/db/schema";
import { authSchema } from "@/validators/auth";

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    isCoach: { label: "IsCoach", type: "boolean" },
    email: { label: "Email", type: "text" },
    username: { label: "Userame", type: "text", optional: true },
    password: { label: "Password", type: "password" },
    avatarUrl: { label: "AvatarUrl", type: "string" },
  },
  async authorize(credentials) {
    let validatedCredentials: {
      isCoach: boolean,
      email: string;
      username?: string;
      password: string;
      avatarUrl: string;
    };

    try {
      if (typeof credentials.isCoach === "string")
      {
        credentials.isCoach = credentials.isCoach?.toLowerCase() === "true";
      }
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      console.log(error);
      console.log("Wrong credentials. Try again.");
      return null;
    }

    const { isCoach, email, username, password, avatarUrl } = validatedCredentials;

    const [existedUser] = await db
      .select({
        id: usersTable.displayId,
        isCoach: usersTable.isCoach,
        username: usersTable.username,
        email: usersTable.email,
        provider: usersTable.provider,
        hashedPassword: usersTable.hashedPassword,
        avatarUrl: usersTable.avatarUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.email, validatedCredentials.email.toLowerCase()))
      .execute();

    if (!existedUser) {
      // Sign up
      if (!username) {
        console.log("Name is required.");
        return null;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

        const [createdUser] = await db
          .insert(usersTable)
          .values({
            isCoach: isCoach,
            username: username,
            email: email.toLowerCase(),
            hashedPassword,
            provider: "credentials",
            avatarUrl: avatarUrl,
          })
          .returning();

        console.log(createdUser);

        // const [createdProfile] = await tx
        //   .insert(profileInfoTable)
        //   .values({
        //     userId: createdUser.displayId,
        //     displayName: createdUser.username,
        //     sportType: sportType,
        //     age: age,
        //     height: height,
        //     weight: weight,
        //     place: place,
        //     license: license,
        //   })
        //   .returning();

          // console.log(createdProfile);

        return {
          email: createdUser.email,
          name: createdUser.username,
          id: createdUser.displayId,
          avatarUrl: createdUser.avatarUrl,
        };
      }

    // Sign in
    if (existedUser.provider !== "credentials") {
      console.log(`The email has registered with ${existedUser.provider}.`);
      return null;
    }
    if (!existedUser.hashedPassword) {
      console.log("The email has registered with social account.");
      return null;
    }

    const isValid = await bcrypt.compare(password, existedUser.hashedPassword);
    if (!isValid) {
      console.log("Wrong password. Try again.");
      return null;
    }
    return {
      email: existedUser.email,
      name: existedUser.username,
      id: existedUser.id,
      avartarUrl: existedUser.avatarUrl,
    };
  },
});
