import React from 'react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <div className="preloader-circle"></div>
          <div className="preloader-circle"></div>
          <div className="preloader-circle"></div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-primary">ECOIA</h2>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;