import { Link } from "@tanstack/react-router";
import { Users, BarChart3, Briefcase, Gift, Building2, Home } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span className="font-bold">Deputados PT</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            to="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
          >
            <Home className="h-4 w-4 inline mr-1" />
            Inicio
          </Link>
          <Link
            to="/deputies"
            className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
          >
            <Users className="h-4 w-4 inline mr-1" />
            Deputados
          </Link>
          <Link
            to="/analytics"
            className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Estatisticas
          </Link>
          <Link
            to="/positions"
            className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
          >
            <Briefcase className="h-4 w-4 inline mr-1" />
            Cargos
          </Link>
          <Link
            to="/benefits"
            className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
          >
            <Gift className="h-4 w-4 inline mr-1" />
            Apoios
          </Link>
          <Link
            to="/shareholdings"
            className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
          >
            <Building2 className="h-4 w-4 inline mr-1" />
            Sociedades
          </Link>
        </nav>
      </div>
    </header>
  );
}
