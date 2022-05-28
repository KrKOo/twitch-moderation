import { OverlayElementTransform, OverlayElementProps } from 'components/OverlayElement/OverlayElement'
import * as React from 'react'

enum ActionType {
  ADD_SHAPE,
  ADD_IMAGE,
  ADD_TEXT,
  REMOVE_OBJECT,
  UPDATE_TRANSFORMATION,
  UPDATE_RESOLUTION
}

interface RelativeTransform {
  relativeWidth: number;
  relativeHeight: number;
  relativeX: number;
  relativeY: number;
}

export type RelativeOverlayElementTransform = RelativeTransform & Omit<OverlayElementTransform, 'x' | 'y' | 'width' | 'height'>;

export interface Transformation extends RelativeOverlayElementTransform {
  id: number;
}

type Scale = {
  x: number;
  y: number;
}

type Action =
  { type: ActionType.ADD_SHAPE, data: any } |
  { type: ActionType.ADD_IMAGE, data: string } |
  { type: ActionType.ADD_TEXT, data: string } |
  { type: ActionType.REMOVE_OBJECT, data: number } |
  { type: ActionType.UPDATE_TRANSFORMATION, data: Transformation } |
  { type: ActionType.UPDATE_RESOLUTION, data: Scale }

type Dispatch = (action: Action) => void

type DashboardContextProviderProps = { children: React.ReactNode }

type State = {
  elements: (OverlayElementProps & RelativeTransform)[]
  scale: Scale;
}

const DashboardContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined)

const getAbsoluteTransform = (element: RelativeOverlayElementTransform, scale: Scale) => {
  return ({
    width: element.relativeWidth / (element.scaleX * scale.x),
    height: element.relativeHeight / (element.scaleY * scale.y),
    x: element.relativeX / scale.x,
    y: element.relativeY / scale.y
  })
}

const onUpdateTransformation = (state: State, transformation: Transformation) => {
  const newState = { ...state };
  const index = newState.elements.findIndex((element: OverlayElementProps) => element.id === transformation.id);
  if (index !== -1) {
    const newElementTransform = getAbsoluteTransform(transformation, newState.scale);
    newState.elements[index] = { ...newState.elements[index], ...transformation, ...newElementTransform };
  }
  return newState;
}

const onUpdateResolution = (state: State, scale: Scale) => {
  const newState = { ...state };
  newState.scale = scale;

  newState.elements = newState.elements.map((element) => {
    element = { ...element, ...getAbsoluteTransform(element, scale) }
    return element
  })

  return newState;
}

const actionReducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.ADD_SHAPE: {
      return state;
    }
    case ActionType.ADD_IMAGE: {
      return state;
    }
    case ActionType.ADD_TEXT: {
      return state;
    }
    case ActionType.REMOVE_OBJECT: {
      return state;
    }
    case ActionType.UPDATE_TRANSFORMATION: {
      return onUpdateTransformation(state, action.data);
    }
    case ActionType.UPDATE_RESOLUTION: {
      return onUpdateResolution(state, action.data);
    }
  }
}

// For testing purpose only
const initialState: State = {
  scale: { x: 1, y: 1 },
  elements: [{
    id: 1,
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    relativeWidth: 100,
    relativeHeight: 100,
    relativeX: 100,
    relativeY: 100,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    isImage: true,
    value: "https://www.industrialempathy.com/img/remote/ZiClJf-1920w.jpg",
  }]
};

const DasboardContextProvider = ({ children }: DashboardContextProviderProps) => {
  const [state, dispatch] = React.useReducer(actionReducer, initialState)
  const value = { state, dispatch }
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

const useDashboardContext = () => {
  const context = React.useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DasboardContextProvider')
  }
  return context
}

export { DasboardContextProvider, useDashboardContext, ActionType };
export type { Scale };
