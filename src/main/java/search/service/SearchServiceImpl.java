package search.service;

import java.util.*;
import java.time.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import main.dto.HomeDTO;
import search.repo.SearchRepoCar;
import search.repo.SearchRepoService;
@Transactional
@Service
public class SearchServiceImpl implements SearchService {
    // @Autowired
    // private SearchDAO searchDAO;

    @Autowired
    private SearchRepoService searchRepoService;

    @Autowired
    private SearchRepoCar searchRepoCar;

    // @Override
    // public List<SearchDTO> getSearchList(SearchDTO searchDTO) {
    //     List<SearchDTO> list = searchDAO.findAll();
    //     return list;
    // }

    @Override
    public List<Long> searchId(LocalDate startDate, LocalDate endDate, LocalTime startTime, LocalTime endTime, int minPrice, int maxPrice) {
        // JPA를 사용하여 엔티티 검색
        List<Long> carIds = searchRepoService.findCarIdsByServiceDatesAndTimes(startDate, endDate, startTime, endTime);
        carIds = searchRepoCar.findCarIdsByPrice(minPrice,maxPrice, carIds);
        return carIds;
    }

    @Override
    public List<HomeDTO> searchCar(List<Long> carIds) {
        throw new UnsupportedOperationException("Unimplemented method 'searchCar'");
    }

}
