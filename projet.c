#include <stdio.h>
#include <string.h>
#include "projet.h"

int ajouterLivre(Livre t[], int n) {
    if (n >= 100)
        return n;

    printf("Entrez le Titre : ");
    getchar();
    gets(t[n].titre);

    printf("Entre le nom de Auteur : ");
    gets(t[n].auteur);

    printf("Entre Annee : ");
    scanf("%d", &t[n].annee);

    printf("Entre ISBN : ");
    scanf("%d", &t[n].isbn);

    t[n].emprunte = 0;

    return n + 1;
}

void afficherLivres(Livre t[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d. %s - %s (%d) [%s]\n", i + 1,t[i].titre, t[i].auteur, t[i].annee,t[i].emprunte ? "Emprunte" : "Dispo");
    }
}

void rechercherLivre(Livre t[], int n) {
    char mot[50];
    printf("Mot-cle (titre ou auteur) : ");
    getchar();
    gets(mot);

    for (int i = 0; i < n; i++) {
        if (strcmp(t[i].titre, mot) == 0 || strcmp(t[i].auteur, mot) == 0) {
            printf("%s - %s (%d) [ISBN:%d]\n",t[i].titre, t[i].auteur, t[i].annee, t[i].isbn);
        }
    }
}

int supprimerLivre(Livre t[], int n) {
    int code;
    printf("ISBN a supprimer : ");
    scanf("%d", &code);

    for (int i = 0; i < n; i++) {
        if (t[i].isbn == code) {
            for (int j = i; j < n - 1; j++) {
                t[j] = t[j + 1];
            }
            return n - 1;
        }
    }
    return n;
}

int emprunterLivre(Livre t[], int n, Emprunt e[], int ne) {
    int code;
    printf("ISBN : ");
    scanf("%d", &code);
    getchar();

    for (int i = 0; i < n; i++) {
        if (t[i].isbn == code && t[i].emprunte == 0) {
            t[i].emprunte = 1;

            e[ne].isbn = code;
            printf("Nom Eleve : ");
            gets(e[ne].nom);

            printf("Date : ");
            gets(e[ne].date);

            return ne + 1;
        }
    }

    return ne;
}

void retournerLivre(Livre t[], int n) {
    int code;
    printf("ISBN retour : ");
    scanf("%d", &code);

    for (int i = 0; i < n; i++) {
        if (t[i].isbn == code) {
            t[i].emprunte = 0;
        }
    }
}

void afficherStat(Livre t[], int n, int ne) {
    int dispo = 0;
    for (int i = 0; i < n; i++) {
        if (!t[i].emprunte)
            dispo++;
    }

    printf("Total : %d | Empruntés : %d | Dispo : %d\n", n, ne, dispo);
}
