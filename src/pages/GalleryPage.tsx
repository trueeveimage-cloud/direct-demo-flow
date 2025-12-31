import { motion } from "framer-motion";

// Import all gallery images
import nomiaLogo from "@/assets/nomia-logo.png";
import nomiaCover from "@/assets/nomia-cover.png";

const galleryImages = [
  { src: nomiaLogo, title: "Nomia Logo", category: "Logo" },
  { src: nomiaCover, title: "Nomia Cover", category: "Cover" },
  { src: "/gallery/cover-1.png", title: "Laptop Mockup", category: "Cover" },
  { src: "/gallery/cover-2.png", title: "Before/After", category: "Cover" },
  { src: "/gallery/cover-3.png", title: "Multi-Device", category: "Cover" },
  { src: "/gallery/logo-1.png", title: "N Mark Geometric", category: "Logo" },
  { src: "/gallery/logo-2.png", title: "N Mark Script", category: "Logo" },
];

const GalleryPage = () => {
  const handleDownload = (src: string, title: string) => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Brand Gallery
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Logos and cover images for Nomia. Click any image to download.
          </p>
        </motion.div>

        {/* Logos Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Logos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages
              .filter((img) => img.category === "Logo")
              .map((image, index) => (
                <motion.div
                  key={image.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleDownload(image.src, image.title)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center group-hover:text-foreground transition-colors">
                    {image.title}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Covers Section */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Cover Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryImages
              .filter((img) => img.category === "Cover")
              .map((image, index) => (
                <motion.div
                  key={image.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => handleDownload(image.src, image.title)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-video bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 text-center group-hover:text-foreground transition-colors">
                    {image.title}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
