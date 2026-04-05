# Contributing to RdRx

Thanks for considering contributing to RdRx! Your input is welcome — whether it's code, documentation, or ideas to improve the project.

**Looking to get started?** Check out the [To-do list](TODO.md) for tasks that need help.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). All contributors are expected to respect and follow it.

## Getting Started

To get the project up and running, follow the instructions in the [README.md](./README.md).

Please test your changes locally before submitting a pull request.

## How to Contribute

We welcome:

- 🐛 Bug reports
- ✨ Feature additions
- 🧼 Code improvements and refactors
- 📝 Documentation updates

All changes that **break backward compatibility** must include:

- A detailed explanation of what changed
- Clear migration instructions
- A helper tool or fallback for existing users if possible

## Pull Request Process

- Use a **separate branch** for contributions. It’s fine to group related changes into a single branch.
- Test the project locally to ensure your changes work.
- Format your code using the command in `package.json`:

  ```bash
  npm run format
  ```

- Use clear commit messages with conventional prefixes:
  - Use the following prefixes for your commit messages:
    - feat: new feature
    - fix: bug fix
    - docs: documentation only changes
    - refactor: code changes that neither fix a bug nor add a feature
    - style: formatting, missing semi colons, etc.

License

By contributing, you agree that your contributions will be licensed under the [GNU GPLv3](LICENSE.md).
