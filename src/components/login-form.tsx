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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenue de retour</CardTitle>
          <CardDescription>
            Connectez-vous avec votre compte Apple ou Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSignIn("apple")}
              >
                Connexion avec Apple
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSignIn("google")}
              >
                Connexion avec Google
              </Button>
            </div>
            <div className="text-center text-sm">
              Vous n&apos;avez pas de compte ?{" "}
              <a href="#" className="underline underline-offset-4">
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
  );
}
