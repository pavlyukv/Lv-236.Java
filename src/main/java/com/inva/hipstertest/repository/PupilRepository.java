package com.inva.hipstertest.repository;

import com.inva.hipstertest.domain.Pupil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Pupil entity.
 */
@SuppressWarnings("unused")
public interface PupilRepository extends JpaRepository<Pupil, Long> {

    @Query(value = "select pupil.id from Pupil pupil left join pupil.form form where form.id = :formId")
    List<Long> findAllByFormId(@Param("formId") Long formId);

    @Query("select pupil from Pupil pupil where pupil.user.login = ?#{principal.username}")
    Pupil findPupilByCurrentUser();
}
