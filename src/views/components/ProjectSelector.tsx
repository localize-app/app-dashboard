import React, { useState, useEffect } from 'react';
import { Select, Typography, Space } from 'antd';

import apiServices from '@/api/apiServices';
import { Project } from '@/types/projects.types';

const { Option } = Select;
const { Title } = Typography;

interface ProjectSelectorProps {
  onProjectSelect: (projectId: string) => void;
  selectedProject?: string;
  children?: React.ReactNode;
}

const ProjectSelector = ({
  onProjectSelect,
  selectedProject = '',
  children,
}: ProjectSelectorProps) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);

  const [hasSelection, setHasSelection] = useState(false);

  // Fetch available projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiServices.projects.getAll({
          isArchived: false,
        });
        setProjects(response);
        console.log(response);

        // Auto-select first project if none selected
        if (!selectedProject && response.length > 0) {
          onProjectSelect(response[0].id);
          setHasSelection(true);
        } else if (selectedProject) {
          setHasSelection(true);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Update hasSelection state when selectedProject changes
    setHasSelection(!!selectedProject);
  }, [selectedProject]);

  const handleProjectChange = (value: string) => {
    onProjectSelect?.(value);
    setHasSelection(true);
  };

  return (
    <div className="project-selector-container">
      {hasSelection ? (
        // After selection - dropdown at top with children below
        <div className="flex flex-col w-full">
          <div className="mb-4 pb-4 border-b">
            <Space>
              <Title level={5} className="m-0">
                Project:
              </Title>
              <Select
                placeholder="Select a project"
                loading={loading}
                onChange={handleProjectChange}
                value={selectedProject}
                style={{ width: 240 }}
                disabled={loading}
              >
                {projects.map((project) => (
                  <Option key={project.id} value={project.id}>
                    {project.name}
                  </Option>
                ))}
              </Select>
            </Space>
          </div>

          {/* Children content below */}
          <div className="project-content">{children}</div>
        </div>
      ) : (
        // Initial state - centered dropdown
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Title level={4} className="mb-6">
            Select a Project to Continue
          </Title>
          <Select
            placeholder="Select a project"
            loading={loading}
            onChange={handleProjectChange}
            style={{ width: 300 }}
            disabled={loading}
            size="large"
          >
            {projects.map((project) => (
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
