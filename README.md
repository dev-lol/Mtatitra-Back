# Mtatitra

1. Configuer le fichier **.env**

> DB_DATABASE=< Nom de la base de donnee (Elle doit exister)>
>
> DB_PASSWORD=< Mot de passe de la base de donnee >
>
> DB_USER=< Username de la base de donnee >
>
> DB_HOST=< URL de la base de donnee >
>
> DB_PORT=< Port de la base de donnee >
>
> PORT=< Port du site web >
>
> ADMIN_PASS_PHRASE=< Alphanumeric 20 caracter minimum unique >
>
> CLIENT_PASS_PHRASE=< Alphanumeric 20 caracter minimum unique >
>
> COURSIER_PASS_PHRASE=< Alphanumeric 20 caracter minimum unique >
>
> MAIL_MTATITRA=< adresse gmail pour confirmation par email configuré prealablement [Gmail Less Secure](https://myaccount.google.com/lesssecureapps) > Voir le fichier `src/utils/SendEmail.ts`
>
> PASS_MTATITRA=< mot de passe du gmail >
>

2. Lancer `npm install`
3. Lancer `npm build`
4. Lancer `npm start` pour demarrer le serveur
