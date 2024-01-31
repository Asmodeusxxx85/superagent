"use client"

import * as React from "react"
import { defaultKeymap } from "@codemirror/commands"
import { LanguageSupport, StreamLanguage } from "@codemirror/language"
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml"
import { indentationMarkers } from "@replit/codemirror-indentation-markers"
import { githubLight } from "@uiw/codemirror-theme-github"
import CodeMirror from "@uiw/react-codemirror"
import * as yaml from "js-yaml"
import { TbCommand } from "react-icons/tb"
import { useAsyncFn } from "react-use"

const langYaml = new LanguageSupport(StreamLanguage.define(yamlMode.yaml))

const initialValue =
  "# 👋 Welcome! Create your worflows using yaml below.\n# More info in our docs: https://docs.superagent.sh"

export default function Saml({
  workflow,
  profile,
}: {
  workflow: any
  profile: any
}) {
  const latestWorkflowConfig = workflow.workflowConfigs.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]
  const workflowConfigsYaml = yaml.dump(latestWorkflowConfig.config, {
    lineWidth: -1,
  })
  const [value, setValue] = React.useState<string>(
    `${initialValue}\n\n${workflowConfigsYaml}`
  )
  const onChange = React.useCallback((val: string) => {
    setValue(val)
  }, [])

  const [{ loading: isSavingConfig }, saveConfig] = useAsyncFn(
    async (value: string) => {
      console.log(value)
    },
    [value]
  )
  const customKeymap = [
    ...defaultKeymap,
    { key: "Mod-S", run: saveConfig, preventDefault: true },
  ]

  return (
    <div className="relative h-full flex-[40%] flex-col">
      <div className="flex border-b px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Last update:{" "}
          {new Date(latestWorkflowConfig.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
      <CodeMirror
        theme={githubLight}
        value={value}
        onChange={onChange}
        extensions={[langYaml, indentationMarkers(), customKeymap]}
        height="100%"
        indentWithTab={true}
        style={{
          border: "none",
          outline: "none",
          height: "100%",
        }}
      />
      <div className="absolute bottom-4 flex w-full flex-col items-center justify-center space-y-4 px-6 py-12">
        <p className="flex items-center space-x-1 text-sm text-muted-foreground">
          <span>Press</span>
          <code className="relative flex rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            <div className="flex items-center">
              <TbCommand />
              <span>S</span>
            </div>
          </code>
          <span>to save</span>
        </p>
      </div>
    </div>
  )
}
