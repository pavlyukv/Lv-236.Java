package com.inva.hipstertest.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String HEAD_TEACHER = "ROLE_HEAD_TEACHER";

    public static final String PARENT = "ROLE_PARENT";

    public static final String PUPIL = "ROLE_PUPIL";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    private AuthoritiesConstants() {
    }
}
