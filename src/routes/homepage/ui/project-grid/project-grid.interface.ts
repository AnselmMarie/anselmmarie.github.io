export interface ProjectItemProps {
  id: string;
  thumbnail: string;
  title: string;
}

export interface ProjectGridProps {
  data: Array<ProjectItemProps>;
  onClick: (...params: any) => void;
}
