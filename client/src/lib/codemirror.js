import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';

/**
 * 🛰️ UTILITY: CODE MIRROR EXTENSION RESOLVER
 * -----------------------------------------
 * Maps project language identifiers to CodeMirror language packages.
 */
export const getLanguageExtension = (lang) => {
  switch (lang) {
    case 'javascript':
    case 'typescript': 
      return [javascript({ jsx: true, typescript: lang === 'typescript' })];
    case 'python': return [python()];
    case 'java': return [java()];
    case 'cpp': return [cpp()];
    case 'rust': return [rust()];
    case 'go': return [go()];
    case 'php': return [php()];
    case 'sql': return [sql()];
    default: return [javascript()];
  }
};
