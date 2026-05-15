import React, { useState, useMemo } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Check, ChevronsUpDown, X, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const defaultSkills = [
  "React.js", "Node.js", "MongoDB", "JavaScript", "Python", "Next.js", 
  "TypeScript", "Tailwind CSS", "Express.js", "Redux", "GraphQL", 
  "PostgreSQL", "Docker", "AWS", "Firebase", "Java", "C++", "Rust", 
  "Go", "Flutter", "React Native", "Vue.js", "Angular", "Svelte"
];

const SkillsInput = ({ value = [], onChange }) => {
  const [query, setQuery] = useState("");

  const filteredSkills = useMemo(() => {
    return query === ""
      ? defaultSkills.filter((skill) => !value.includes(skill))
      : defaultSkills.filter((skill) =>
          skill.toLowerCase().includes(query.toLowerCase().trim()) &&
          !value.includes(skill)
        );
  }, [query, value]);

  const handleAddSkill = (skill) => {
    if (!skill) return;
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !value.includes(trimmedSkill)) {
      onChange([...value, trimmedSkill]);
    }
    setQuery("");
  };

  const removeSkill = (skillToRemove) => {
    onChange(value.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="w-full space-y-4">
      {/* Selected Skills chips */}
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        <AnimatePresence>
          {value.map((skill) => (
            <motion.span
              key={skill}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm font-medium border border-pink-200/50 dark:border-pink-800/50 shadow-sm transition-all hover:shadow-md group"
            >
              <Hash size={12} className="opacity-70" />
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:bg-pink-200 dark:hover:bg-pink-800 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${skill}`}
              >
                <X size={14} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {value.length === 0 && (
          <p className="text-sm text-muted-foreground italic px-1 py-1.5">No skills added yet...</p>
        )}
      </div>

      <Combobox value={null} onChange={handleAddSkill}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-xl border border-input bg-background/50 backdrop-blur-sm text-left focus-within:ring-2 focus-within:ring-pink-500/20 transition-all duration-200">
            <Combobox.Input
              className="w-full border-none py-2.5 pl-3 pr-10 text-sm leading-5 bg-transparent focus:ring-0 outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="Search or add a skill (e.g. Kotlin)"
              displayValue={(skill) => skill}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  e.preventDefault();
                  handleAddSkill(query);
                }
              }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown
                className="h-5 w-5 text-muted-foreground hover:text-pink-500 transition-colors"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-background/95 backdrop-blur-md border border-border py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm custom-scrollbar">
              {filteredSkills.length === 0 && query !== "" ? (
                <div 
                  className="relative cursor-pointer select-none py-2 px-4 text-foreground/80 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                  onClick={() => handleAddSkill(query)}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-pink-500">Add custom:</span>
                    <span className="font-bold underline">"{query}"</span>
                  </span>
                </div>
              ) : (
                filteredSkills.map((skill) => (
                  <Combobox.Option
                    key={skill}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2.5 pl-10 pr-4 transition-colors ${
                        active ? "bg-pink-500 text-white" : "text-foreground"
                      }`
                    }
                    value={skill}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                          {skill}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-pink-600"
                            }`}
                          >
                            <Check className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default SkillsInput;
