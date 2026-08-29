import React from 'react';
import PixelCard from './ui/PixelCard';

const PixelCardExample: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Pixel Card Examples</h1>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Basic Usage</h2>
        <div className="flex flex-wrap gap-4">
          <PixelCard title="Default Card" description="This is a default pixel card.">
            <p>Card content goes here</p>
          </PixelCard>
          
          <PixelCard 
            title="With Border Effect" 
            description="This card has the pixel border effect."
            bordered
          >
            <p>Card with bordered effect</p>
          </PixelCard>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Color Variations</h2>
        <div className="flex flex-wrap gap-4">
          <PixelCard title="Primary" color="primary" bordered>
            <p>Primary colored card</p>
          </PixelCard>
          
          <PixelCard title="Secondary" color="secondary" bordered>
            <p>Secondary colored card</p>
          </PixelCard>
          
          <PixelCard title="Success" color="success" bordered>
            <p>Success colored card</p>
          </PixelCard>
          
          <PixelCard title="Danger" color="danger" bordered>
            <p>Danger colored card</p>
          </PixelCard>
          
          <PixelCard title="Warning" color="warning" bordered>
            <p>Warning colored card</p>
          </PixelCard>
          
          <PixelCard title="Info" color="info" bordered>
            <p>Info colored card</p>
          </PixelCard>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Size Variations</h2>
        <div className="flex flex-wrap items-start gap-4">
          <PixelCard title="Small" size="sm" bordered>
            <p>Small size card</p>
          </PixelCard>
          
          <PixelCard title="Medium" size="md" bordered>
            <p>Medium size card (default)</p>
          </PixelCard>
          
          <PixelCard title="Large" size="lg" bordered>
            <p>Large size card</p>
          </PixelCard>
        </div>
      </div>
      
      <div>
        <h2 className="mb-4 text-xl font-semibold">Custom Styling</h2>
        <PixelCard 
          className="max-w-sm"
          title="Custom Styled Card" 
          description="You can apply custom classes to the card."
          bordered
        >
          <div className="flex justify-between">
            <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Button 1
            </button>
            <button className="rounded bg-transparent0 px-4 py-2 font-bold text-white hover:bg-gray-700">
              Button 2
            </button>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default PixelCardExample; 
