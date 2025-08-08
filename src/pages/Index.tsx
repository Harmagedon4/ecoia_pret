// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          ECOIA
        </h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Plateforme de prêts écologiques pour un avenir durable
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/connexion" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Se connecter
          </a>
          <a href="/inscription" className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition-colors">
            S'inscrire
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
