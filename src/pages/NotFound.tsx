import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg mx-auto"
      >
        {/* Large 404 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <span className="font-heading font-extrabold text-8xl sm:text-9xl text-foreground/10">
            404
          </span>
        </motion.div>

        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Search className="w-8 h-8 text-accent" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          {t('Sidan kunde inte hittas', 'Page not found')}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t(
            'Sidan du letar efter finns inte eller har flyttats. Kontrollera webbadressen eller gå tillbaka till startsidan.',
            "The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('Gå tillbaka', 'Go back')}
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              {t('Till startsidan', 'To homepage')}
            </Link>
          </Button>
        </div>

        {/* Attempted URL */}
        <p className="mt-8 text-xs text-muted-foreground/50 font-mono">
          {location.pathname}
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
