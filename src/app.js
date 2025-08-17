import React, { useState, useRef, useEffect } from 'react';
import { 
  Heading1, Text, Image, PanelTop, PanelBottom, Trash2, Edit2, PlusCircle,
  Download, Eye, Search, LayoutGrid, Save, BookOpen, X, Maximize, Minimize
} from 'lucide-react';

// Main App component for the web builder
export default function App() {
  // State to hold the components on the canvas
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const nextId = useRef(0);
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const [quillLoaded, setQuillLoaded] = useState(false);
  
  // Advanced feature states
  const [previewOpen, setPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookTitle, setBookTitle] = useState('My Web Book');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  // Templates for quick start
  const templates = [
    {
      name: "Blog Post",
      components: [
        { id: 1, type: 'header', content: '<h1>My Blog Post</h1>' },
        { id: 2, type: 'image', content: 'https://placehold.co/800x400/94A3B8/FFFFFF?text=Featured+Image' },
        { id: 3, type: 'paragraph', content: '<p>This is the introduction to my blog post...</p>' },
        { id: 4, type: 'heading', content: '<h2>Main Section</h2>' },
        { id: 5, type: 'paragraph', content: '<p>Detailed content goes here...</p>' },
        { id: 6, type: 'footer', content: '<p>&#169; 2024 My Blog. All rights reserved.</p>' }
      ]
    },
    {
      name: "Product Page",
      components: [
        { id: 1, type: 'header', content: '<h1>Awesome Product</h1>' },
        { id: 2, type: 'image', content: 'https://placehold.co/600x400/94A3B8/FFFFFF?text=Product+Image' },
        { id: 3, type: 'paragraph', content: '<p>Discover our amazing product that solves all your problems...</p>' },
        { id: 4, type: 'heading', content: '<h2>Features</h2>' },
        { id: 5, type: 'paragraph', content: '<ul><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul>' },
        { id: 6, type: 'footer', content: '<p>&#169; 2024 Our Company. All rights reserved.</p>' }
      ]
    }
  ];

  // Fix for Quill.js reverse typing issue
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
    script.onload = () => {
      setQuillLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && selectedComponent && ['heading', 'paragraph', 'header', 'footer'].includes(selectedComponent.type) && quillLoaded) {
      if (!quillInstance.current) {
        quillInstance.current = new window.Quill(quillRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'header': [1, 2, 3, false] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'align': [] }],
              ['link'],
            ],
          },
          // Fix for reverse typing issue
          formats: ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'indent', 'link', 'align', 'direction'],
        });
      }

      // Set content and enforce LTR direction
      quillInstance.current.root.innerHTML = selectedComponent.content;
      quillInstance.current.format('direction', 'ltr');
      quillInstance.current.format('align', 'left');

      const handleTextChange = () => {
        if (selectedComponent) {
          const newContent = quillInstance.current.root.innerHTML;
          const updatedComponents = components.map(comp =>
            comp.id === selectedComponent.id ? { ...comp, content: newContent } : comp
          );
          setComponents(updatedComponents);
          setSelectedComponent({ ...selectedComponent, content: newContent });
        }
      };

      quillInstance.current.on('text-change', handleTextChange);

      return () => {
        if (quillInstance.current) {
          quillInstance.current.off('text-change', handleTextChange);
        }
      };
    } else {
      if (quillInstance.current) {
        quillInstance.current = null;
        if (quillRef.current) {
          quillRef.current.innerHTML = '';
        }
      }
    }
  }, [selectedComponent, components, quillLoaded]);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('componentType', type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    
    const newComponent = {
      id: nextId.current++,
      type,
      content: getInitialContent(type),
    };
    
    setComponents([...components, newComponent]);
  };

  const getInitialContent = (type) => {
    switch (type) {
      case 'heading':
        return '<h1>New Heading</h1>';
      case 'paragraph':
        return '<p>This is a new paragraph.</p>';
      case 'image':
        return 'https://placehold.co/600x400/94A3B8/FFFFFF?text=Placeholder+Image';
      case 'header':
        return '<h1>Your Company Name</h1>';
      case 'footer':
        return '<p>&#169; 2024 Your Company. All rights reserved.</p>';
      default:
        return '';
    }
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
  };

  const handleDeleteComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedComponents = components.map(comp =>
          comp.id === selectedComponent.id ? { ...comp, content: reader.result } : comp
        );
        setComponents(updatedComponents);
        setSelectedComponent({ ...selectedComponent, content: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate HTML for download
  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${bookTitle}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3 { color: #2d3748; }
    img { max-width: 100%; height: auto; }
    .header, .footer { text-align: center; padding: 20px 0; }
    .content { margin: 30px 0; }
  </style>
</head>
<body>
  ${components.map(comp => {
    if (comp.type === 'header') return `<div class="header">${comp.content}</div>`;
    if (comp.type === 'footer') return `<div class="footer">${comp.content}</div>`;
    if (comp.type === 'image') return `<div class="image"><img src="${comp.content}" alt="Content image" /></div>`;
    return `<div class="content">${comp.content}</div>`;
  }).join('\n')}
</body>
</html>`;
  };

  // Download as HTML file
  const handleDownload = () => {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bookTitle.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save project locally
  const handleSaveProject = () => {
    const projectData = {
      title: bookTitle,
      components: components,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('webBookProject', JSON.stringify(projectData));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // Load project from local storage
  const handleLoadProject = () => {
    const savedProject = localStorage.getItem('webBookProject');
    if (savedProject) {
      const projectData = JSON.parse(savedProject);
      setComponents(projectData.components);
      setBookTitle(projectData.title);
    }
  };

  // Apply template
  const applyTemplate = (template) => {
    setComponents(template.components.map(comp => ({
      ...comp,
      id: nextId.current++
    })));
    nextId.current += template.components.length;
    setTemplateModalOpen(false);
  };

  // Filter components based on search query
  const filteredComponents = components.filter(comp => {
    if (!searchQuery) return true;
    if (comp.type === 'image') {
      return comp.content.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return comp.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Render component based on type
  const ComponentRenderer = ({ type, content, onClick }) => {
    switch (type) {
      case 'heading':
      case 'paragraph':
      case 'header':
      case 'footer':
        return (
          <div
            className="p-2 cursor-pointer"
            onClick={onClick}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        );
      case 'image':
        return (
          <img
            src={content}
            alt="User uploaded content"
            className="w-full h-auto rounded-lg shadow-md cursor-pointer"
            onClick={onClick}
          />
        );
      default:
        return null;
    }
  };

  // Draggable button for sidebar
  const DraggableButton = ({ type, text, icon: Icon }) => (
    <div
      className="bg-gray-100 text-gray-800 p-3 rounded-lg shadow flex flex-col items-center cursor-grab active:cursor-grabbing hover:bg-gray-200 transition-colors"
      draggable
      onDragStart={(e) => handleDragStart(e, type)}
    >
      <Icon className="w-6 h-6 mb-1 text-blue-500" />
      <span className="font-medium text-xs">{text}</span>
    </div>
  );

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(console.log);
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Quill stylesheet */}
      <style>{`@import url('https://cdn.quilljs.com/1.3.6/quill.snow.css');`}</style>

      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md py-3 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">WebBook Builder</h1>
        </div>
        
        <div className="flex-1 max-w-lg mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Book Title"
            className="px-3 py-1 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setPreviewOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            <span>Preview</span>
          </button>
          
          <button 
            onClick={handleSaveProject}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Save className="w-4 h-4 mr-1" />
            <span>Save</span>
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Download className="w-4 h-4 mr-1" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Save Success Indicator */}
      {showSaveSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in">
          <Save className="w-5 h-5 mr-2" />
          Project saved successfully!
        </div>
      )}

      {/* Template Modal */}
      {templateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Choose a Template</h2>
              <button 
                onClick={() => setTemplateModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template, index) => (
                <div 
                  key={index}
                  className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => applyTemplate(template)}
                >
                  <div className="bg-gray-100 p-4 flex items-center">
                    <LayoutGrid className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold">{template.name}</h3>
                  </div>
                  <div className="p-4 h-40 overflow-y-auto">
                    {template.components.map((comp, idx) => (
                      <div key={idx} className="mb-3 last:mb-0">
                        {comp.type === 'image' ? (
                          <div className="text-xs text-gray-500 flex items-center">
                            <Image className="w-4 h-4 mr-2" /> Image Component
                          </div>
                        ) : (
                          <div 
                            className="text-xs truncate"
                            dangerouslySetInnerHTML={{ __html: comp.content }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Live Preview</h2>
              <button 
                onClick={() => setPreviewOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto p-6">
              <div dangerouslySetInnerHTML={{ __html: generateHTML() }} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 p-6 gap-6">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-xl shadow-lg p-5 flex-shrink-0 flex flex-col">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold">Components</h2>
            <button 
              onClick={() => setTemplateModalOpen(true)}
              className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100"
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Templates
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <DraggableButton type="heading" text="Heading" icon={Heading1} />
            <DraggableButton type="paragraph" text="Paragraph" icon={Text} />
            <DraggableButton type="image" text="Image" icon={Image} />
            <DraggableButton type="header" text="Header" icon={PanelTop} />
            <DraggableButton type="footer" text="Footer" icon={PanelBottom} />
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Saved Projects</h3>
            <button 
              onClick={handleLoadProject}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Load Last Project
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div
            className="flex-grow bg-white rounded-xl shadow-lg p-6 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Canvas</h2>
              <div className="text-sm text-gray-500">
                {components.length} component{components.length !== 1 ? 's' : ''}
                {searchQuery && ` • ${filteredComponents.length} found`}
              </div>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl flex-grow p-6 space-y-4 overflow-y-auto">
              {components.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-gray-100 p-8 rounded-xl max-w-md">
                    <BookOpen className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Start Building Your Web Book</h3>
                    <p className="text-gray-600 mb-6">
                      Drag components from the sidebar or choose a template to get started
                    </p>
                    <button 
                      onClick={() => setTemplateModalOpen(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Browse Templates
                    </button>
                  </div>
                </div>
              ) : (
                filteredComponents.map((comp) => (
                  <div
                    key={comp.id}
                    className={`group relative p-4 rounded-lg border-2 transition-all ${
                      selectedComponent && selectedComponent.id === comp.id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <ComponentRenderer
                      type={comp.type}
                      content={comp.content}
                      onClick={() => handleComponentClick(comp)}
                    />
                    <button
                      onClick={() => handleDeleteComponent(comp.id)}
                      className="absolute top-2 right-2 p-1 text-red-500 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      title="Delete component"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="w-80 bg-white rounded-xl shadow-lg p-5 flex-shrink-0 flex flex-col">
          <h2 className="text-lg font-bold mb-5">Editor</h2>
          
          {selectedComponent ? (
            <div className="flex-1 overflow-auto">
              <div className="flex items-center text-gray-600 mb-4">
                <Edit2 className="w-5 h-5 mr-2" />
                <span className="font-semibold capitalize">{selectedComponent.type}</span>
              </div>
              
              {selectedComponent.type === 'image' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Source
                  </label>
                  <input
                    type="text"
                    value={selectedComponent.content}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      const updatedComponents = components.map(comp =>
                        comp.id === selectedComponent.id ? { ...comp, content: newContent } : comp
                      );
                      setComponents(updatedComponents);
                      setSelectedComponent({ ...selectedComponent, content: newContent });
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter image URL"
                  />
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  
                  {selectedComponent.content && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preview
                      </label>
                      <img 
                        src={selectedComponent.content} 
                        alt="Preview" 
                        className="rounded-lg border shadow-sm max-h-40 object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <div 
                    ref={quillRef} 
                    className="bg-white rounded-lg border border-gray-300 overflow-hidden"
                    style={{ minHeight: '200px', direction: 'ltr' }}
                  ></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Select a component on the canvas to edit it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
