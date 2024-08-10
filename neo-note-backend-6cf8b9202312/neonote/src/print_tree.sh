#!/bin/bash
#this script prints the directory tree of whatever argument (path) you provide when running the script
#for example, to run the script and print the backend directory tree, (if git is installed) the following should work
#./print_tree.sh C:\<wherever your repo is saved>\IdeaProjects\backend\neonote\src
#IF YOU DO NOT PROVIDE A PATH the script will print your ENTIRE computer's directory tree

output_file="directory_tree.txt"

print_tree() {
  local dir="$1"
  local indent="${2:-0}"

  echo "$(basename "$dir")/"
  echo "$(basename "$dir")/" >> "$output_file"

  for item in "$dir"/*; do
    [ -e "$item" ] || continue
    for ((i=0; i<indent; i++)); do
      echo -n "|   "
      echo -n "|   " >> "$output_file"
    done
    if [ -d "$item" ]; then
      print_tree "$item" "$((indent+1))"
    else
      echo "$(basename "$item")"
      echo "$(basename "$item")" >> "$output_file"
      cat "$item"
    fi
  done
}

# Clear the output file if it exists
> "$output_file"

print_tree .

read -p "Press Enter to exit..."
