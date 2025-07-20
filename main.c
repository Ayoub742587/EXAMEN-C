#include <stdio.h>
#include "projet.h"

int main() {
    Livre livres[100];
    Emprunt emprunts[90];
    int nbLivres = 0, nbEmprunts = 0, choix;

    do {
        printf("\n1-Ajouter 2-Afficher 3-Rechercher 4-Supprimer\n");
        printf("5-Emprunter 6-Retourner 7-Stats 0-Quitter\n");
        printf("Choix : ");
        scanf("%d", &choix);

        switch (choix) {
            case 1:
                nbLivres = ajouterLivre(livres, nbLivres);
                break;
            case 2:
                afficherLivres(livres, nbLivres);
                break;
            case 3:
                rechercherLivre(livres, nbLivres);
                break;
            case 4:
                nbLivres = supprimerLivre(livres, nbLivres);
                break;
            case 5:
                nbEmprunts = emprunterLivre(livres, nbLivres, emprunts, nbEmprunts);
                break;
            case 6:
                retournerLivre(livres, nbLivres);
                break;
            case 7:
                afficherStat(livres, nbLivres, nbEmprunts);
                break;
        }

    } while (choix != 0);

    return 0;
}
