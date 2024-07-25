# AiIsHardToLearn
### A criminal offense punishment finder
okay uh i cant program ais so i forced chatgpt to write the actual code

the dataset itself is custom-made by me, feel free to change or tweak it, idc; some of the punishments are a bit extreme, like littering, but the littering ones are deserved

i dont claim ownership of this bc i didnt write the code, do whatever with it.


## What does this AI do?
well, basically, it just takes an input crime + details (offense #, if they're a juvenile or not, if they plead guilty) and it then finds the closest pre-made case in the dataset and then assigns the punishment to the person. it's probably quite easy to modify it, but im not smart with ai so yeah

## What packages does this use?
it uses chalk & natural, so just run `npm i chalk natural` to get the dependant packages (i also have prettier installed as well, just for the organization and stuff)


Example Input:

```ansi
\033[33m$\033[0m node .

Enter the crime: Kidnapping

Enter the details of the crime: First offense

---

\033[32mSuitable Punishment Found: Execution by Gas Chamber, Possible Vindication\033[0m
```
