typedef struct {
    char titre[50];
    char auteur[30];
    int annee;
    int isbn;
    int emprunte;
} Livre;

typedef struct {
    int isbn;
    char nom[30];
    char date[11];
} Emprunt;

int ajouterLivre(Livre[], int);
void afficherLivres(Livre[], int);
void rechercherLivre(Livre[], int);
int supprimerLivre(Livre[], int);
int emprunterLivre(Livre[], int, Emprunt[], int);
void retournerLivre(Livre[], int);
void afficherStat(Livre[], int, int);
