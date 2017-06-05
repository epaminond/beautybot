# Beautybot

This is a test-app, created on top of [Botpress](https://github.com/botpress/botpress) that is intended to demonstrate MVP of real-world usage within a beauty-saloon.

Tasks are managed within [Trello-board](https://trello.com/b/V0wZGYbZ/audition-sirius.ai).

## Running app locally

1. Make sure to have node installed
2. Make sure you have Postgres >=9.5 installed and running
3. Create Postgres-database like this: `sudo -u postgres psql postgres -c "CREATE DATABASE sirius-beauty WITH ENCODING 'UTF8'"`, where `sirius_beauty` is database name and `postgres` - your Postgres superuser
4. Create postgres.js configuration file based on template: `cp postgres.js.example postgres.js`
4. You can now start application via `botpress start`
5. [Configure Messenger connection settings](https://github.com/botpress/botpress-examples/tree/master/hello-world-bot#6-configure-messenger-connection-settings)

## Deployments

We are using Heroku as our [staging server](https://siriusai-beautybot.herokuapp.com/).

To deploy latest version you need to:
1. Add heroku remote `heroku git:remote -a siriusai-beautybot`
2. run `git push heroku master`.

## Code style

We are using eslint to ensure consisten code-style. We also have [pre-commit](https://github.com/observing/pre-commit) to make sure all the code gets validated before commit.
