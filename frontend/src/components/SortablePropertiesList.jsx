import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { propertiesAPI } from "../services/api";
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Helper function to get image URL from different formats
const DEFAULT_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23E5E7EB'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23737475' font-family='Arial' font-size='18'>No Image Available</text></svg>")}`;
const API_BASE_URL = "https://api.shoahomes.com";
const getImageUrl = (img) => {
  if (!img) return DEFAULT_PLACEHOLDER;
  // If it's a full URL, return as is
  if (
    typeof img === 'string' &&
    (img.startsWith('http') || img.startsWith('blob:'))
  ) {
    return img;
  }
  // If it's a file object with a preview (from file upload)
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  // If it's an object with a path or url
  if (typeof img === 'object' && (img.path || img.url)) {
    const url = img.path || img.url;
    if (url.startsWith('http') || url.startsWith('blob:')) {
      return url;
    }
    // Prepend API base URL if it's a relative path
    return API_BASE_URL + url;
  }
  // Fallback to placeholder
  return DEFAULT_PLACEHOLDER;
};

function SortablePropertyItem({ property, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {/* Property Image */}
        <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
          {property.images?.[0] ? (
            <img
              src={getImageUrl(property.images[0])}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
          <p className="text-sm text-gray-600 truncate">{property.location}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {property.type}
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {property.status}
            </span>
            {property.featured && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(property)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SortablePropertiesList({ properties, onEdit, onDelete }) {
  const [items, setItems] = useState(properties.map(p => p.id));
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update the order on the server
        propertiesAPI.reorder(newItems)
          .then(() => {
            toast.success('Properties reordered successfully!');
            // Invalidate queries to refresh the UI
            queryClient.invalidateQueries(['admin-properties']);
            queryClient.invalidateQueries({ queryKey: ['properties'], exact: false });
          })
          .catch((error) => {
            toast.error('Failed to reorder properties');
            console.error('Reorder error:', error);
            // Revert the local state on error
            setItems(items);
          });

        return newItems;
      });
    }
  }

  // Create a map of properties by ID for quick lookup
  const propertiesMap = properties.reduce((map, property) => {
    map[property.id] = property;
    return map;
  }, {});

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((id) => {
            const property = propertiesMap[id];
            if (!property) return null;

            return (
              <SortablePropertyItem
                key={id}
                property={property}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}