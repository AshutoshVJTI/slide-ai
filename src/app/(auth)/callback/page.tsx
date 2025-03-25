import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

const AuthCallbackPage = async () => {
  try {
    console.log("Starting authentication callback...");
    const auth = await onAuthenticateUser();
    console.log("Auth result:", auth);

    if (auth.status === 200 || auth.status === 201) {
      console.log("Authentication successful, redirecting to dashboard...");
      redirect("/dashboard");
    } else {
      console.error("Authentication failed with status:", auth.status);
      // Add a small delay to prevent immediate redirect loop
      await new Promise(resolve => setTimeout(resolve, 1000));
      redirect("/sign-in");
    }
  } catch (error) {
    console.error("Callback error:", error);
    redirect("/sign-in");
  }
};

export default AuthCallbackPage;