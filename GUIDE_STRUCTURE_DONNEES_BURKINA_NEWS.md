# 🇧🇫 BURKINA NEWS · GUIDE DE STRUCTURE ET FORMAT DES DONNÉES
**Manuel officiel de référence pour la Rédaction, les Enquêteurs, le Desk Données et les Contributeurs**  
*Version 3.2 — Édition 2026*

---

> ### 🎯 Objectif du document
> Ce guide fournit la nomenclature exacte, les types de données, les règles éditoriales déontologiques et les **gabarits prêts à l'emploi sous forme de tableaux** pour préparer tous les contenus de **Burkina News** avant intégration dans le back-office ou transmission par e-mail au Desk central de publication.

---

## 0. Les 3 Niveaux de Preuve Déontologiques (Charte V3)

Pour garantir la crédibilité de Burkina News, chaque information est adossée à une source identifiée.  
> **⚡ NOTE IMPORTANTE : Le Niveau B (recoupement physique systématique de terrain) n'est PAS obligatoire pour l'instant.** Il reste facultatif et optionnel à ce stade.

| Niveau | Nature de la preuve requise | Obligation pour le rédacteur |
| :--- | :--- | :--- |
| **Niveau A (Preuve documentaire)** | Document officiel vérifié, Décret, Journal Officiel, Procès-Verbal de réception, rapport public d'audit (Cour des Comptes, ASCE-LC, DGMG, INSD). | Indiquer le nom de l'institution et la date du document. Joindre le fichier PDF ou le lien officiel si disponible. |
| **Niveau B (Recoupement terrain)** | Constat physique direct sur le terrain par le journaliste ou recoupement auprès de témoins directs. | **⚡ NON OBLIGATOIRE POUR L'INSTANT**<br>*(Ce niveau reste optionnel et facultatif à ce stade du lancement de la rédaction).* |
| **Niveau C (Déclaration / Info courante)** | Déclaration officielle, communiqué de presse, interview, dépêche d'actualité ou projection. | Citer expressément la source entre guillemets ou employer le conditionnel (ex: *« selon la direction... »*). |

---

## 1. Les Articles & Grandes Enquêtes (`Article`)

Les articles constituent le cœur documentaire du journal. Tout article doit comporter des données chiffrées sourcées, des intertitres clairs et un chapô d'accroche rigoureux.

> **✍️ PRINCIPE POUR LE RÉDACTEUR : Le corps du texte est rédigé en Texte libre enrichi.**  
> Vous rédigez librement vos paragraphes dans votre traitement de texte habituel. Vous pouvez y insérer des sous-titres, des citations, des photographies légendées, des vidéos (liens YouTube ou fichiers), des liens web et des documents PDF téléchargeables. Aucune syntaxe informatique (comme le Markdown) n'est exigée des journalistes.

### Tableau des champs attendus

| Nom du Champ | Type de donnée | Obligatoire ? | Règle & Format attendu | Exemple concret |
| :--- | :--- | :---: | :--- | :--- |
| **Titre (FR)** | Texte court | **OUI** | Percutant, factuel, sans sensationnalisme. Max 100 caractères. | *Manganèse de Tambao : autopsie d'un bras de fer économique et logistique* |
| **Titre (EN)** | Texte court | Optionnel | Traduction anglaise au standard journalistique Reuters / Financial Times. | *Tambao Manganese: Anatomy of an Economic and Logistical Standoff* |
| **Rubrique** | Sélecteur | **OUI** | L'une des 7 rubriques : `economie`, `securite`, `chantiers`, `agriculture`, `societe`, `histoire`, `idees`. | `economie` |
| **Format / Type** | Sélecteur | **OUI** | `decryptage`, `terrain`, `vrai-ou-faux`, `edito`, `le-chiffre`, `trois-questions`, `analyse`. | `decryptage` |
| **Chapô (FR)** | Texte (2-3 phrases) | **OUI** | Résumé percutant résumant le problème, le chiffre clé et l'enjeu. Max 350 caractères. | *Au cœur des ambitions ferroviaires burkinabè des années 1980, le gisement de Tambao cristallise les tensions avec les bailleurs internationaux.* |
| **Chapô (EN)** | Texte (2-3 phrases) | Optionnel | Traduction en anglais du chapô. | *At the heart of Burkinabè railway ambitions in the 1980s, the Tambao deposit crystallized tensions with foreign donors.* |
| **Corps de l'enquête** | Texte libre enrichi (avec images, vidéos, liens, PDF) | **OUI** | Rédigé librement en texte courant avec :<br>• Grands titres et sous-titres de parties<br>• Citations mises en exergue<br>• Intégration de photographies légendées<br>• Intégration de vidéos (liens ou vidéos intégrées)<br>• Liens vers des documents officiels ou pièces PDF | **Titre Partie 1 : L'enclavement par le rail**<br>Au milieu des années 1980, le Burkina fait face à un défi structurel...<br><br>*[Photo : Gare de Bobo]*<br>*[Lien vidéo : Archives discours Tambao]*<br>*[Lien PDF : Décret officiel]*<br><br>« Nous devons compter sur nos propres forces. » |
| **Photo Couverture** | Image (JPG/PNG) | **OUI** | Format paysage (16:9), haute définition (> 1200px de large), nette et représentative. | `photo_tambao_chemin_fer.jpg` |
| **Auteur** | Texte | **OUI** | Nom complet du journaliste d'investigation ou mention « Desk Données ». | *Alfred Ouédraogo & Desk Enquêtes* |
| **Temps de lecture** | Texte court | **OUI** | Estimation de lecture (calculé à ~200 mots/minute). | *7 min* |
| **Nombre de sources** | Nombre entier | **OUI** | Nombre de documents primaires ou témoignages directs vérifiés. | *5 sources vérifiées* |
| **Niveau de confiance** | Sélecteur | **OUI** | `high` (Niveau A), `medium` (Niveau B - optionnel), `low` (Niveau C). | `high` |
| **Mots-clés / Tags** | Liste de mots-clés | **OUI** | 3 à 6 tags pour le moteur de recherche et les filtres. | *Mines, Tambao, Sahel, Chemin de fer, PND 2026* |

### Fiche Gabarit Vierge pour préparer un Article

| Rubrique de la fiche | Contenu à renseigner par le rédacteur |
| :--- | :--- |
| **Titre de l'enquête (FR) :** | `[Écrire ici votre titre percutant]` |
| **Titre en anglais (EN) :** | `[Écrire ici la traduction anglaise si disponible]` |
| **Rubrique :** | [ ] Économie &nbsp;&nbsp; [ ] Sécurité &nbsp;&nbsp; [ ] Chantiers &nbsp;&nbsp; [ ] Agriculture &nbsp;&nbsp; [ ] Société &nbsp;&nbsp; [ ] Histoire &nbsp;&nbsp; [ ] Idées |
| **Format d'investigation :** | [ ] Décryptage &nbsp;&nbsp; [ ] Terrain &nbsp;&nbsp; [ ] Vrai ou Faux &nbsp;&nbsp; [ ] Éditorial &nbsp;&nbsp; [ ] Le Chiffre &nbsp;&nbsp; [ ] Analyse |
| **Chapô / Résumé (FR) :** | `[Rédiger ici 2 à 3 phrases résumant les faits clés et les chiffres vérifiés]` |
| **Nombre de sources / Preuves :** | `[Indiquer le nombre total de documents primaires consultés]` · Niveau : [ ] A (Document) &nbsp;&nbsp; [ ] B (Terrain - Optionnel) &nbsp;&nbsp; [ ] C (Déclaration) |
| **Mots-clés / Tags :** | `[Ex: Coton, Bobo-Dioulasso, Industrie, Budget 2026]` |
| **Crédit Auteur(s) :** | `[Nom de l'enquêteur ou signature de rédaction]` |
| **Corps de l'article (Texte libre enrichi) :** | **1. [Premier Sous-Titre de partie]**<br>`[Texte courant du premier paragraphe avec chiffres en valeur]`<br><br>« [Citation d'un responsable ou extrait de déclaration] »<br>— [Source de la citation, date]<br><br>**2. [Deuxième Sous-Titre de partie]**<br>`[Texte explicatif du constat]`<br><br>📷 **[Photo insérée : Légende + Crédit photo]**<br>🎥 **[Vidéo insérée : Lien YouTube ou fichier vidéo]**<br>📄 **[Document joint : Lien vers PDF ou pièce officielle]** |
| **Fichiers joints fournis :** | 1. Photo de couverture : `[nom_du_fichier.jpg]`<br>2. Photos d'illustration du corps : `[photo1.jpg, photo2.jpg]`<br>3. Pièces justificatives PDF : `[rapport_audit.pdf, decret.pdf]` |

---

## 2. Le Fil d'Actualité Certifié / Dépêches (`BriefFact`)

Le Fil est l'espace de diffusion instantanée des faits certifiés. Chaque brève doit être lisible en 60 secondes chrono, adossée à une source primaire incontestable, sans extrapolation.

### Tableau des champs d'une dépêche

| Nom du Champ | Type de donnée | Obligatoire ? | Règle éditoriale & Norme | Exemple concret |
| :--- | :--- | :---: | :--- | :--- |
| **Heure (time)** | Heure (HH:mm) | **OUI** | Heure exacte de la décision ou du constat officiel. | *08:45* |
| **Date** | Date (AAAA-MM-JJ) | **OUI** | Date de publication de la dépêche. | *2026-09-09* |
| **Titre de la dépêche** | Texte court | **OUI** | Action ou fait brut au présent journalistique. Max 90 caractères. | *Campagne cotonnière 2026 : le prix d'achat du premier choix fixé à 325 FCFA/kg* |
| **Fait certifié (FR)** | Texte (1 min) | **OUI** | 3 à 5 lignes de fait brut avec chiffres clés en gras. | *Le Conseil des ministres réuni ce mercredi a adopté le barème officiel d'achat pour la campagne 2026-2027. Le prix garanti au producteur progresse de 15 FCFA par rapport à la saison précédente. L'enveloppe de subvention des intrants est maintenue à **14 milliards FCFA**.* |
| **Fait certifié (EN)** | Texte (1 min) | Recommandé | Traduction concise en anglais pour les partenaires bilatéraux. | *The Council of Ministers approved official purchasing prices for the 2026-2027 cotton season, setting the first-grade price at 325 FCFA/kg, up 15 FCFA.* |
| **Source primaire** | Texte | **OUI** | Organisme officiel ou document vérifié d'où provient l'information. | *Compte-rendu du Conseil des Ministres / Ministère de l'Agriculture* |
| **Lien de la source** | URL valide | Recommandé | Lien officiel vers le communiqué ou document scanné. | `https://sig.bf/conseil-des-ministres/2026-09-09` |
| **Rubrique** | Sélecteur | **OUI** | `economie`, `securite`, `chantiers`, `agriculture`, `societe`, `histoire`. | `agriculture` |
| **Pourquoi c'est important** | Texte (2 phrases) | Recommandé | Perspective économique ou impact direct pour les populations. | *Garantit la visibilité financière de plus de 350 000 producteurs des régions de l'Ouest avant le début des récoltes.* |

### Fiche Gabarit Vierge pour le Fil (Dépêche 1 Minute)

| Rubrique | Contenu à renseigner |
| :--- | :--- |
| **Horodatage & Rubrique :** | Date : `[2026-XX-XX]` · Heure : `[HH:mm]` · Rubrique : `[Agriculture / Éco / Sécurité...]` |
| **Titre du fait certifié :** | `[Écrire ici le titre brut du fait au présent]` |
| **Texte certifié (FR) :** | `[Rédiger le fait en 3 à 5 lignes avec chiffres clés et noms d'institutions exacts]` |
| **Traduction anglaise (EN) :** | `[Traduction concise du fait en anglais]` |
| **Source primaire vérifiée :** | Organisme : `[Ministère / DGMG / SONABEL]` · Document : `[Réf Décret / Arrêté / PV]` |
| **Pourquoi c'est important :** | `[Expliquer en 1 phrase l'enjeu souverain ou l'impact concret pour les citoyens]` |

---

## 3. Le Tracker des Chantiers d'Infrastructure (`Project`)

Le Tracker est la base de données vivante de monitoring des dépenses et projets publics. Chaque fiche projet doit être adossée à une vérification physique et administrative rigoureuse.

### Tableau des champs d'un chantier

| Nom du Champ | Type de donnée | Obligatoire ? | Règle éditoriale & Norme | Exemple concret |
| :--- | :--- | :---: | :--- | :--- |
| **Nom du projet (FR)** | Texte | **OUI** | Intitulé complet officiel du projet public. | *Centrale Solaire Photovoltaïque de Zina (20 MWc)* |
| **Nom du projet (EN)** | Texte | Recommandé | Intitulé officiel en anglais. | *Zina Solar Photovoltaic Power Plant (20 MWp)* |
| **Secteur** | Sélecteur | **OUI** | Transport, Énergie, Eau & Assainissement, Mines, Agriculture, Santé, Éducation. | *Énergie* |
| **Région burkinabè** | Sélecteur | **OUI** | L'une des 13 régions (Centre, Hauts-Bassins, Boucle du Mouhoun, Est, etc.). | *Boucle du Mouhoun* |
| **Budget validé (FCFA)** | Montant | **OUI** | Enveloppe globale en FCFA mentionnée dans le contrat officiel. | *18,5 milliards FCFA* |
| **Statut vérifié** | Sélecteur (Ordre strict) | **OUI** | `annonce` ➔ `engage` ➔ `en-construction` ➔ `inaugure` ➔ `operationnel` ➔ `impact-mesure`. | `operationnel` |
| **Taux d'avancement (%)** | Nombre (0 à 100) | **OUI** | Pourcentage physique d'exécution certifié par procès-verbal. | *100%* |
| **Description synthétique** | Texte en Markdown | **OUI** | Présentation des caractéristiques techniques, objectifs et bénéficiaires. | *Installation de 43 000 panneaux solaires pour alimenter le réseau interconnecté de la SONABEL et réduire la facture thermique.* |
| **Acteurs clés** | Liste (Rôle + Nom) | **OUI** | Maître d'ouvrage, entreprise réalisatrice, bailleurs de fonds. | Maître d'ouvrage : *Ministère de l'Énergie*<br>Opérateur : *AMEA Power*<br>Distributeur : *SONABEL* |
| **Dernière vérification** | Date (AAAA-MM-JJ) | **OUI** | Date du dernier audit physique ou documentaire réalisé par la rédaction. | *2026-08-10* |
| **Historique des jalons** | Tableau de dates | **OUI** | Dates et sources de chaque étape franchie (pose de 1ère pierre, livraison). | `2024-03` : Lancement des travaux (PV pose 1ère pierre)<br>`2026-06` : Synchronisation réseau (PV SONABEL) |

### Fiche Gabarit Vierge pour le Tracker

| Rubrique | Contenu à renseigner |
| :--- | :--- |
| **Nom du chantier (FR / EN) :** | FR : `[Nom complet officiel]`<br>EN : `[Official English Name]` |
| **Secteur & Région :** | Secteur : `[Transport / Énergie / Eau / Mines...]` · Région : `[Centre / Hauts-Bassins...]` |
| **Budget global & Avancement :** | Budget : `[XX milliards FCFA]` · Avancement physique : `[XX %]` |
| **Statut actuel vérifié :** | [ ] Annoncé &nbsp;&nbsp; [ ] Engagé &nbsp;&nbsp; [ ] En construction &nbsp;&nbsp; [ ] Inauguré &nbsp;&nbsp; [ ] Opérationnel &nbsp;&nbsp; [ ] Impact mesuré |
| **Acteurs du projet :** | Maître d'ouvrage : `[Ministère / Direction Générale]`<br>Entreprise / Prestataire : `[Nom de l'entreprise adjudicataire]`<br>Bailleur(s) : `[Budget de l'État / Partenaire bilatéral]` |
| **Description & Dernier jalon :** | Description : `[Résumé des caractéristiques physiques et utilité publique]`<br>Dernier jalon vérifié : `[Constat opéré le AAAA-MM-JJ sur la base du PV N° XXX]` |
| **Preuves documentaires :** | 1. PV d'attribution / Marché : `[nom_du_fichier.pdf]`<br>2. Rapport de visite de terrain : `[nom_du_fichier.pdf]` |

---

## 4. Le Baromètre RELANCE - Indicateurs Macroéconomiques (`Indicator`)

Le Baromètre suit 14 indicateurs macroéconomiques et de souveraineté. Chaque indicateur compare les chiffres actuels aux cibles officielles du Plan National de Développement (PND 2026-2030).

### Tableau des champs d'un indicateur

| Nom du Champ | Type de donnée | Obligatoire ? | Règle éditoriale & Norme | Exemple concret |
| :--- | :--- | :---: | :--- | :--- |
| **Nom de l'indicateur** | Texte | **OUI** | Nom clair de la métrique économique mesurée. | *Production Nationale d'Or Industriel* |
| **Code standard** | Texte (Majuscules) | **OUI** | Code d'identification unique interne. | `IND-OR-01` |
| **Définition méthodologique** | Texte | **OUI** | Méthode de calcul et périmètre statistique exact. | *Volume total d'or brut et affiné extrait par les compagnies minières industrielles titulaires d'un permis d'exploitation.* |
| **Unité de mesure** | Texte | **OUI** | Tonnes, %, Milliards FCFA, Points, etc. | *Tonnes métriques* |
| **Valeur de référence (Baseline)** | Nombre + Année | **OUI** | Chiffre de départ servant de point de comparaison. | *57,6 tonnes (2025)* |
| **Valeur actuelle constatée** | Nombre + Année | **OUI** | Dernier chiffre consolidé publié par la statistique officielle. | *59,2 tonnes (2026)* |
| **Cible PND 2028** | Nombre | Recommandé | Objectif fixé à mi-parcours par le plan national. | *65,0 tonnes* |
| **Cible PND 2030** | Nombre | **OUI** | Cible stratégique officielle à l'horizon 2030. | *70,0 tonnes* |
| **Tendance constatée** | Sélecteur | **OUI** | `up` (Hausse), `down` (Baisse), `stable` (Stabilité). | `up` |
| **Source officielle primaire** | Texte | **OUI** | Organisme public certificateur (DGMG, INSD, BCEAO, Douanes). | *Direction Générale des Mines et de la Géologie (DGMG)* |
| **Rubrique associée** | Sélecteur | **OUI** | `economie`, `agriculture`, `securite`, `chantiers`, `societe`. | `economie` |

### Fiche Gabarit Vierge pour le Baromètre

| Rubrique | Contenu à renseigner |
| :--- | :--- |
| **Nom de l'indicateur & Code :** | Nom : `[Nom de l'indicateur]` · Code : `[IND-XXX-XX]` |
| **Définition & Périmètre :** | `[Expliquer précisément ce qui est mesuré et comment c'est calculé]` |
| **Unité de mesure :** | `[Milliards FCFA / % / Tonnes / Millions d'habitants / Points]` |
| **Valeurs constatées :** | Baseline : `[Valeur]` (Année : `[AAAA]`) · Valeur actuelle : `[Valeur]` (Année/Mois : `[AAAA-MM]`) |
| **Cibles officielles PND :** | Cible PND 2028 : `[Valeur]` · Cible PND 2030 : `[Valeur]` |
| **Tendance & Source primaire :** | Tendance : [ ] En hausse &nbsp;&nbsp; [ ] En baisse &nbsp;&nbsp; [ ] Stable<br>Source officielle : `[Nom de l'institution officielle émettrice (DGMG, INSD, BCEAO)]` |

---

## 5. Les Numéros Mensuels (`Issue`)

Chaque mois, la rédaction publie une édition mensuelle regroupant les meilleures enquêtes, un éditorial du Directeur de publication et un fichier PDF de mise en page magazine haute définition téléchargeable.

### Tableau des champs d'un numéro

| Nom du Champ | Type de donnée | Obligatoire ? | Règle éditoriale & Norme | Exemple concret |
| :--- | :--- | :---: | :--- | :--- |
| **Numéro de parution** | Nombre entier | **OUI** | Numérotation séquentielle continue (1, 2, 3...). | *N° 02* |
| **Titre du dossier central** | Texte | **OUI** | Le thème phare traité en une du magazine. | *Souveraineté Économique & Réindustrialisation : L'An II* |
| **Titre en anglais (EN)** | Texte | Recommandé | Traduction anglaise du titre de l'édition. | *Economic Sovereignty & Reindustrialization: Year II* |
| **Date de parution** | Date (AAAA-MM-JJ) | **OUI** | Date officielle de mise en ligne du numéro. | *2026-08-01* |
| **Couverture HD** | Fichier Image (JPG) | **OUI** | Format A4 vertical haute résolution (minimum 2480 x 3508 px). | `couverture_numero_02.jpg` |
| **Éditorial / Sommaire** | Texte en Markdown | **OUI** | Texte de l'éditorial signé du Directeur de publication + plan des enquêtes. | *L'indépendance ne se proclame pas, elle se construit usine par usine...* |
| **Articles rattachés** | Liste d'identifiants | **OUI** | Liste des 4 à 8 identifiants d'articles inclus dans l'édition. | `art-01, art-02, art-03, art-04, art-05` |
| **Fichier PDF Complet** | Fichier Document (PDF) | **OUI** | Fichier PDF complet prêt à imprimer et archiver (< 25 Mo). | `burkina_news_edition_mensuelle_02.pdf` |

### Fiche Gabarit Vierge pour un Numéro

| Rubrique | Contenu à renseigner |
| :--- | :--- |
| **Numéro & Date :** | Numéro : `[N° XX]` · Mois / Année : `[Ex: Septembre 2026]` · Date exacte : `[AAAA-MM-JJ]` |
| **Titre principal du numéro :** | FR : `[Titre du grand dossier d'enquête]`<br>EN : `[English Title]` |
| **Éditorial de la publication :** | `[Rédiger ici l'éditorial officiel du numéro signé par le Directeur éditorial]` |
| **Enquêtes incluses (Sommaire) :** | 1. Enquête Lead : `[Titre de l'enquête]`<br>2. Dossier Éco : `[Titre]`<br>3. Enquête Chantiers : `[Titre]`<br>4. Regard Histoire : `[Titre]` |
| **Fichier Couverture HD :** | Nom du fichier visuel : `[couverture_numero_XX.jpg]` |
| **Fichier PDF Magazine Complet :** | Nom du fichier PDF : `[burkina_news_numero_XX_complet.pdf]` |

---

## 6. Registre des Corrections Déontologiques (`Correction`)

Burkina News s'interdit toute modification clandestine d'articles publiés. Toute rectification factuelle doit faire l'objet d'une inscription publique au Registre des Corrections avec mention du motif et validation d'un responsable éditorial.

| Nom du Champ | Type de donnée | Obligatoire ? | Règle éditoriale | Exemple concret |
| :--- | :--- | :---: | :--- | :--- |
| **Date de rectification** | Date (AAAA-MM-JJ) | **OUI** | Date où la correction est portée au registre public. | *2026-08-15* |
| **Article concerné** | Titre + Slug | **OUI** | Titre exact de l'article ayant fait l'objet de l'erratum. | *Le Burkina produit-il plus d'or ? (`burkina-faso-production-or`)* |
| **Texte initial erroné** | Texte | **OUI** | Passage exact qui contenait l'inexactitude. | *Production nationale consolidée de 59 tonnes en 2025 selon les prévisions.* |
| **Texte rectifié exact** | Texte | **OUI** | Nouvelle formulation exacte adossée au document probant. | *Production nationale consolidée de 57,6 tonnes selon le rapport définitif.* |
| **Motif de la rectification** | Texte | **OUI** | Explication transparente du motif du rectificatif. | *Publication du rapport annuel définitif consolidé de la DGMG.* |
| **Validé par** | Nom + Fonction | **OUI** | Directeur éditorial ou Superadmin ayant certifié l'erratum. | *Alfred Ouédraogo (Directeur éditorial)* |

---

## 7. Checklist de Transmission Express avant Publication

Avant d'envoyer votre dossier ou de l'insérer dans le back-office, cochez impérativement les 6 points de contrôle suivants :

- [ ] **1. Preuves & Sources :** Chaque chiffre (montant en FCFA, volume en tonnes, pourcentage) est adossé à un document officiel identifié (Niveau A) ou à un double constat de terrain vérifié (Niveau B).
- [ ] **2. Structure Markdown :** Le corps de texte utilise les balises `##` pour les intertitres et `>` pour les citations en exergue (sans astérisques ou puces manuelles fantaisistes).
- [ ] **3. Illustrations & Médias :** Toutes les photos sont en haute définition, libres de droits ou avec crédit d'archive explicite (`Photo : Auteur | Source : Institution`).
- [ ] **4. Documents officiels joints :** Les pièces justificatives (arrêtés, PV, décrets, rapports d'audit) sont jointes en format PDF lisible.
- [ ] **5. Bilinguisme :** Le titre, le chapô et les termes clés sont traduits en anglais de niveau international.
- [ ] **6. Neutralité tonale :** Absence d'adjectifs sensationnalistes ou d'opinions personnelles non étayées : seuls les faits et les données parlent.

---
*Document officiel de travail · Burkina News · Reproduction et diffusion réservées à la rédaction.*
