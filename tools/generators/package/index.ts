import {
    formatFiles,
    generateFiles,
    getImportPath,
    getWorkspaceLayout,
    joinPathFragments,
    names,
    offsetFromRoot,
    Tree,
    writeJson
} from "@nrwl/devkit";

import { updateRootTsConfig } from '@nrwl/js';

import * as path from "path";
import type { Config as StylelintConfig } from 'stylelint';

import type { NxPluginGeneratorSchema } from "./schema";

interface NormalizedSchema extends NxPluginGeneratorSchema {
    projectRoot: string;
    projectDirectory: string;
    importPath: string;
}

function normalizeOptions(
    tree: Tree,
    options: NxPluginGeneratorSchema
): NormalizedSchema {
    const name = names(options.name).fileName;
    const workspaceLayout = getWorkspaceLayout(tree);

    const projectDirectory = `${name}`;
    const projectRoot = `${workspaceLayout.libsDir}/${projectDirectory}`;
    const importPath = getImportPath(workspaceLayout.npmScope, projectDirectory);

    return {
        ...options,
        projectRoot,
        projectDirectory,
        importPath,
    };
}


function addFiles(tree: Tree, options: NormalizedSchema) {
    const templateOptions = {
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        tmpl: '',
    };
    generateFiles(
        tree,
        path.join(__dirname, "files"),
        options.projectRoot,
        templateOptions
    );
}

export default async function (tree: Tree, schema: NormalizedSchema) {
    const normalizedOptions = normalizeOptions(tree, schema);

    updateRootTsConfig(tree, normalizedOptions);
    addFiles(tree, normalizedOptions);

    writeJson<StylelintConfig>(tree, joinPathFragments(normalizedOptions.projectRoot, '.stylelintrc.json'), {
        extends: [joinPathFragments(offsetFromRoot(normalizedOptions.projectRoot), '.stylelintrc.json')],
        ignoreFiles: ['!**/*'],
        overrides: [
            {
                files: [
                    "*.html",
                    "**/*.html",
                ],
                customSyntax: "postcss-html"
            }
        ]
    });

    await formatFiles(tree);
}
