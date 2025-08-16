import { useEffect, useRef } from 'react';

const CKEditor4 = ({ value = '', onChange }) => {
  const editorRef = useRef();

  useEffect(() => {
    if (!window.CKEDITOR) {
      console.error('CKEditor not loaded');
      return;
    }

    const editor = window.CKEDITOR.replace(editorRef.current);
    console.log('value in init ', value)
    editor.setData(value);

    editor.on('change', function () {
      const data = editor.getData();
      onChange && onChange(data);
    });

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [value!='']);

  return <textarea ref={editorRef} />;
};

export default CKEditor4;
