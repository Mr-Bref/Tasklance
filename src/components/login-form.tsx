"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { Input } from "./ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"; // fallback

  const handleSignIn = async (provider: "google" | "apple") => {
    try {
      const { error } = await authClient.signIn.social(
        { provider, callbackURL : callbackUrl },
        {
          onRequest: () => {
            console.log(`Tentative de connexion avec ${provider}...`);
          },
          onSuccess: (ctx) => {
            console.log(`Connexion réussie avec ${provider}.`);
            console.log(ctx.data);
            // Redirige l'utilisateur ou effectue une autre action
          },
          onError: (ctx) => {
            console.error(
              `Erreur lors de la connexion avec ${provider}:`,
              ctx.error
            );
            // Affiche un message d'erreur à l'utilisateur
          },
        }
      );
      if (error) {
        console.error(`Erreur lors de la connexion avec ${provider}:`, error);
      }
    } catch (err) {
      console.error(`Exception lors de la connexion avec ${provider}:`, err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-green-50" >
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenue</CardTitle>
          <CardDescription>Connectez-vous</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Email/Password Login */}
            <form  className="flex flex-col gap-4">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                className="py-5"
                required
              />
              <Input
                name="password"
                type="password"
                className="py-5"
                placeholder="Mot de passe"
                required
              />
              <Button type="submit" className="w-full text-gray-800 font-bold rounded-none py-4 hover:cursor-pointer">
                Connexion
              </Button>
            </form>

            {/* OR divider */}
            <div className="text-center text-muted-foreground text-sm">ou</div>

            {/* Google Login */}
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full bg-green-50 hover:cursor-pointer "
                onClick={() => handleSignIn("google")}
              >
                Connexion avec Google
              </Button>
            </div>

            {/* Register link */}
            <div className="text-center text-sm">
              Vous n&apos;avez pas de compte ?{" "}
              <a href="/register" className="underline underline-offset-4">
                Inscrivez-vous
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs">
        En cliquant sur continuer, vous acceptez nos{" "}
        <a href="#" className="underline underline-offset-4">
          Conditions d&apos;utilisation
        </a>{" "}
        et notre{" "}
        <a href="#" className="underline underline-offset-4">
          Politique de confidentialité
        </a>
        .
      </div>
    </div>
  )
}
