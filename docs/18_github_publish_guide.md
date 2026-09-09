# B2B Catalog CMS GitHub Publish Guide

## Target repository

- Owner: `SepehrQasemi`
- Repository: `B2B Catalog CMS`
- Visibility: `public`

## Recommended publish command

```bash
gh repo create SepehrQasemi/B2B Catalog CMS --public --source=. --remote=origin --push
```

## Verification commands

```bash
git remote -v
git branch --show-current
git status --short
gh repo view SepehrQasemi/B2B Catalog CMS
```

## Notes

- The package metadata already points to `https://github.com/SepehrQasemi/b2b-catalog-cms`
- The repository is intended to be public on GitHub, but the npm package remains `private` because npm publication is not part of the MVP
- If GitHub creation fails because the repository already exists, add the remote manually and push:

```bash
git remote add origin https://github.com/SepehrQasemi/b2b-catalog-cms.git
git push -u origin main
```
