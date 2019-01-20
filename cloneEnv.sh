git submodule init
git submodule update
find "./pathadvisor-frontend-settings" -maxdepth 1 -print | while read file; do
  if [[ $file != *".git"* ]] && [ $file != "./pathadvisor-frontend-settings" ]; then
    ln "$file" .;
  fi
done
