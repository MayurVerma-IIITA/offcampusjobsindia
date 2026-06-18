package com.employee.portal.service;

import com.employee.portal.dto.EmployeeDTO;
import com.employee.portal.entity.EmployeeEntity;
import com.employee.portal.exception.ResourceNotFoundException;
import com.employee.portal.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO getEmployeeById(Long id) {
        EmployeeEntity entity = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapToDTO(entity);
    }

    @Override
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        EmployeeEntity entity = mapToEntity(employeeDTO);
        EmployeeEntity savedEntity = employeeRepository.save(entity);
        return mapToDTO(savedEntity);
    }

    @Override
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        EmployeeEntity entity = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        
        entity.setFirstName(employeeDTO.getFirstName());
        entity.setLastName(employeeDTO.getLastName());
        entity.setEmail(employeeDTO.getEmail());
        entity.setPhone(employeeDTO.getPhone());
        entity.setDepartment(employeeDTO.getDepartment());
        entity.setJobTitle(employeeDTO.getJobTitle());
        entity.setSalary(employeeDTO.getSalary());
        entity.setDateOfJoining(employeeDTO.getDateOfJoining());
        entity.setStatus(employeeDTO.getStatus());
        
        EmployeeEntity updatedEntity = employeeRepository.save(entity);
        return mapToDTO(updatedEntity);
    }

    @Override
    public void deleteEmployee(Long id) {
        EmployeeEntity entity = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(entity);
    }

    @Override
    public List<EmployeeDTO> searchEmployees(String keyword) {
        return employeeRepository.searchByKeyword(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EmployeeDTO mapToDTO(EmployeeEntity entity) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setDepartment(entity.getDepartment());
        dto.setJobTitle(entity.getJobTitle());
        dto.setSalary(entity.getSalary());
        dto.setDateOfJoining(entity.getDateOfJoining());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    private EmployeeEntity mapToEntity(EmployeeDTO dto) {
        EmployeeEntity entity = new EmployeeEntity();
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setDepartment(dto.getDepartment());
        entity.setJobTitle(dto.getJobTitle());
        entity.setSalary(dto.getSalary());
        entity.setDateOfJoining(dto.getDateOfJoining());
        entity.setStatus(dto.getStatus());
        return entity;
    }
}
