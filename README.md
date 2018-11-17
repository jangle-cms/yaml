# Jangle | YAML
> An experiment for a better experience!

### Overview

Using a `.yaml` file seems like a more long-term design solution for Jangle.

If we use code instead of data to represent your models, users can do some JS-specific things that will cause bugs now and make an upgrade path in the future more difficult to follow.

It also will make data modelling simpler and much more accessible to non-devs!

The idea is that a `jangle.yml` file will be the way we represent our content. Just drop a config:

```yaml
version: 1
lists:
  BlogPost:
    title: String
    author: Person
    content: Html

  Person:
    name:
      first: String
      last: String
    bio: Html?
```

That config file will let Jangle know everything it needs to about your model. From there, it can generate a nice UI, API endpoints, whatever!

Representing our models with a text file (instead of building them in a GUI) is great when working on a team, because tools like git make it easy to review changes and collaborate.

If this makes sense, it will eventually become the way we interact with Jangle Core, API, and CMS.

### Local Development

- `npm install`

- `npm run dev`
