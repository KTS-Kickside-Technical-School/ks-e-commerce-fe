import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['code-block'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'code-block',
];

const RichTextEditor = ({ value, onChange, height }: any) => {
  return (
    <div style={{ height: `${height + 40}px`, marginBottom: '30px' }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        style={{ height: `${height}px` }}
        placeholder="Write something..."
      />
    </div>
  );
};

export default RichTextEditor;
