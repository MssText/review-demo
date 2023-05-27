import type { Plugin, PluginCreator as PostCSSPlugin } from 'postcss';

type Processors = keyof Omit<Plugin, 'postcssPlugin' | 'prepare'>;

const plugin: PostCSSPlugin<{ content: string; processor?: Processors }> = (opts = { content: '', processor: 'Once' }) => {
    return {
        postcssPlugin: 'postcss-prepend',
        prepare: () => {
            let prepended = false;
            if (!opts.processor) opts.processor = 'Once';

            return {
                Document(document, { postcss }) {
                    if (!prepended && opts.processor === 'Document') {
                        document.root().append(postcss.parse(opts.content));
                        prepended = true;
                    }
                },
                Once(root, { postcss }) {
                    if (!prepended && opts.processor === 'Once') {
                        root.append(postcss.parse(opts.content));
                        prepended = true;
                    }
                },
            };
        },
    };
};

plugin.postcss = true;

export default plugin;
